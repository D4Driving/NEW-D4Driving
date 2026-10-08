// Tests for lesson-calc.js — run with: node tools/test-lesson-calc.js
const assert = require('assert');
const { bestPrice } = require('../lesson-calc.js');

const cases = [
  // hours, expected total, expected description
  [1,  42,  '1 × 1-hour lesson'],
  [2,  80,  '1 × 2-hour lesson'],
  [3,  120, '2 × 1.5-hour lessons'],                    // cheaper than 2h + 1h (£122)
  [5,  200, '1 × 5-hour block'],                        // ties with lessons; a block wins
  [10, 390, '1 × 10-hour block'],
  [15, 560, '1 × 15-hour block'],
  [20, 740, '1 × 20-hour block'],
  [23, 860, '1 × 20-hour block + 2 × 1.5-hour lessons'],
  [25, 940, '1 × 20-hour block + 1 × 5-hour block'],
  [40, 1480, '2 × 20-hour blocks'],
];

for (const [h, total, desc] of cases) {
  const r = bestPrice(h);
  assert.strictEqual(r.total, total, `${h}h total`);
  assert.strictEqual(r.description, desc, `${h}h description`);
  assert.strictEqual(r.saving, 42 * h - total, `${h}h saving vs £42/hr`);
}

// One exact block links straight to that block's payment page; anything else does not.
assert.strictEqual(bestPrice(20).singleBlock, 20);
assert.strictEqual(bestPrice(23).singleBlock, null);
assert.strictEqual(bestPrice(40).singleBlock, null);

// Out-of-range input is clamped to the slider's range.
assert.strictEqual(bestPrice(0).hours, 1);
assert.strictEqual(bestPrice(99).hours, 40);

// Every hour from 1 to 40 is priced, never above the single-lesson rate.
for (let h = 1; h <= 40; h++) {
  const r = bestPrice(h);
  assert.ok(r.total > 0 && r.total <= 42 * h, `${h}h within bounds`);
}
console.log('all lesson-calc tests pass');
