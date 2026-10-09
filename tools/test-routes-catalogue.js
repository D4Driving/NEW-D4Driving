/*
 * Tests the catalogue loading in routes.html against transient API failures.
 *
 * On 9 Oct 2026 the page rendered no routes at all: /rest/v1/centres returned a
 * cold-start 401 while the other two calls returned 200, and Promise.all threw
 * the good responses away. These tests pin the degradation rules that replaced
 * it — only the catalogue itself is allowed to take the page down.
 *
 * The functions are extracted from routes.html at run time rather than copied,
 * so this keeps testing the shipped code.
 *
 *   node tools/test-routes-catalogue.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const SRC = fs.readFileSync(
  path.join(__dirname, '..', 'routes.html'), 'utf8');

/* Pull one top-level `async function NAME(...) { ... }` out of the page.
   The page indents function bodies but closes at column 0, so the first
   line-initial `}` ends it. */
function extract(name) {
  const start = SRC.indexOf(`async function ${name}(`);
  assert.notStrictEqual(start, -1, `${name}() not found in routes.html`);
  const end = SRC.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, `could not find the end of ${name}()`);
  return SRC.slice(start, end + 2);
}

const results = [];
function check(label, fn) {
  try {
    fn();
    results.push(['ok  ', label]);
  } catch (err) {
    results.push(['FAIL', `${label}\n       ${err.message}`]);
  }
}

/* ── loadCatalogue() ──────────────────────────────────────────────────── */

const ROWS = [
  { id: 'r1', centre_slug: 'peterborough', key: 'stop-sign', is_free: true },
  { id: 'r2', centre_slug: 'peterborough', key: 'waitrose',  is_free: false },
  { id: 'r3', centre_slug: 'kettering',    key: 'pytchley',  is_free: true },
];
const CENTRES = [{ slug: 'peterborough', name: 'Peterborough' }];

/* fails: which of the three calls should reject, by path fragment */
async function runLoadCatalogue(fails = []) {
  const ctx = {
    catalogue: {},
    centres: {},
    accessibleIds: new Set(),
    console: { warn() {}, error() {} },
    async sb(p) {
      if (fails.some(f => p.startsWith(f))) throw new Error('401 simulated');
      if (p.startsWith('routes_public')) return ROWS;
      if (p.startsWith('centres'))       return CENTRES;
      if (p.startsWith('routes?select=id')) return [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }];
      throw new Error('unexpected path ' + p);
    },
  };
  vm.createContext(ctx);
  vm.runInContext(extract('loadCatalogue'), ctx);   // define only
  await vm.runInContext('loadCatalogue()', ctx);    // then run once
  return ctx;
}

(async () => {
  /* 1. Everything works */
  {
    const ctx = await runLoadCatalogue();
    check('all three succeed: routes grouped by centre', () => {
      assert.strictEqual(ctx.catalogue.peterborough.length, 2);
      assert.strictEqual(ctx.catalogue.kettering.length, 1);
    });
    check('all three succeed: centres and entitlements populated', () => {
      assert.strictEqual(ctx.centres.peterborough.name, 'Peterborough');
      assert.strictEqual(ctx.accessibleIds.size, 3);
    });
  }

  /* 2. The exact 9 Oct failure — centres 401s, the rest are fine */
  {
    const ctx = await runLoadCatalogue(['centres']);
    check('centres fails: routes still render (the 9 Oct regression)', () => {
      assert.strictEqual(ctx.catalogue.peterborough.length, 2);
      assert.strictEqual(ctx.catalogue.kettering.length, 1);
    });
    check('centres fails: no pricing, but no crash', () => {
      assert.deepStrictEqual(ctx.centres, {});
    });
  }

  /* 3. Entitlement check unavailable — fall back to is_free */
  {
    const ctx = await runLoadCatalogue(['routes?select=id']);
    check('entitlements fail: routes still render', () => {
      assert.strictEqual(ctx.catalogue.peterborough.length, 2);
    });
    check('entitlements fail: free routes unlocked, paid stay locked', () => {
      assert.ok(ctx.accessibleIds.has('r1'), 'free route should be unlocked');
      assert.ok(ctx.accessibleIds.has('r3'), 'free route should be unlocked');
      assert.ok(!ctx.accessibleIds.has('r2'), 'paid route must stay locked');
    });
  }

  /* 4. The catalogue itself fails — this one IS fatal */
  {
    let threw = false;
    try { await runLoadCatalogue(['routes_public']); } catch { threw = true; }
    check('catalogue fails: throws, so init() shows its error state', () => {
      assert.ok(threw, 'expected loadCatalogue() to reject');
    });
  }

  /* ── sb() retry ─────────────────────────────────────────────────────── */

  async function runSb(responses) {
    let calls = 0;
    const ctx = {
      SUPABASE_URL: 'https://example.test',
      SUPABASE_KEY: 'key',
      accessToken: null,
      setTimeout: (fn) => fn(),          // no real delay in tests
      Promise,
      async fetch() {
        const r = responses[calls++];
        if (r instanceof Error) throw r;
        return { ok: r < 400, status: r, async text() { return ''; }, async json() { return 'DATA'; } };
      },
    };
    vm.createContext(ctx);
    vm.runInContext(extract('sb'), ctx);
    const out = await vm.runInContext("sb('centres?select=*')", ctx);
    return { out, calls };
  }

  {
    const { out, calls } = await runSb([200]);
    check('sb: success on first try makes one request', () => {
      assert.strictEqual(out, 'DATA');
      assert.strictEqual(calls, 1);
    });
  }
  {
    const { out, calls } = await runSb([401, 200]);
    check('sb: a cold-start 401 is retried once and succeeds', () => {
      assert.strictEqual(out, 'DATA');
      assert.strictEqual(calls, 2);
    });
  }
  {
    const { out, calls } = await runSb([new Error('network down'), 200]);
    check('sb: a dropped connection is retried once and succeeds', () => {
      assert.strictEqual(out, 'DATA');
      assert.strictEqual(calls, 2);
    });
  }
  {
    let threw = false, calls = 0;
    try { ({ calls } = await runSb([401, 401])); } catch { threw = true; }
    check('sb: a persistent 401 gives up rather than looping', () => {
      assert.ok(threw, 'expected sb() to reject after the retry');
    });
  }
  {
    let threw = false;
    try { await runSb([404]); } catch { threw = true; }
    check('sb: a 404 is not retried', () => {
      assert.ok(threw, 'expected sb() to reject immediately on 404');
    });
  }

  /* ── report ─────────────────────────────────────────────────────────── */
  for (const [status, label] of results) console.log(`${status}  ${label}`);
  const failed = results.filter(r => r[0] === 'FAIL').length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
