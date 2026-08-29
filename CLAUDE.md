# D4Driving website — working notes

Static site for D4Driving School of Motoring, Peterborough. Plain HTML/CSS/JS,
single-file pages, **no build step**, served by GitHub Pages from `main`.

**This file is read automatically at the start of every session. Keep it short.**
Detail belongs in the private ops repo, not here.

---

## Before doing anything

1. **`git branch` and `git log --oneline -5`.** Work may already exist on a
   branch, and the checked-out branch may not be `main`. A fix was duplicated
   in Aug 2026 because this step was skipped.
2. **Check "In flight" below** for work in progress.
3. `git fetch origin main && git merge origin/main` **before every push** — an
   hourly Action commits to this repo and will otherwise reject the push.

## In flight

| Branch | What | Status |
|---|---|---|
| `lesson-credit-ledger` | Supabase lesson-credit ledger — migrations, instructors table | In progress, do not ship |

`main` is live. Anything merged to `main` is on the public site within ~2 minutes.

## Where things live

| | |
|---|---|
| **This repo (public)** | The website only. Plus `CHANGELOG.md` (written nightly by a routine) and `D4Driving_Franchise_Integration_Plan.md` (the build history, numbered sections). |
| **`D4Driving/d4driving-ops` (private)** | Everything internal — `product/` (PRODUCT.md, DESIGN.md, design critique), `business/` (pricing update, launch kit, project instructions), `plans/` + `specs/` (engineering), `competitors.md` + `reports/`. **Business strategy goes here, never in this repo.** Cloned locally at `Desktop\D4Driving Ops`. |
| **Cloud routines** | Competitor watch (Mondays 07:00 → ops repo `reports/`) and doc catch-up (nightly 20:00 → `CHANGELOG.md`). The nightly one also flags this file when it goes stale. |

## Standing rules

- **Advise before building** anything structural. Present the plan, then build.
- **SEO check on every change**: title/meta, canonical (non-www), OG/Twitter,
  one h1, alt text, schema, sitemap, internal links. Same pass, not a follow-up.
- **Update the docs in the same session** work ships — the Integration Plan and
  the ops repo. Move finished items out of "Pending", don't just append.
- **Never `git add -A`** here. Stage explicit paths and read the file list
  before pushing. This repo is public and pushed history cannot be retracted;
  a blanket add has already swept a private nested repo into a commit once.
- **Never commit** student or customer data, or `*.csv`. Strategy, pricing and
  design docs belong in the ops repo, not here. See `.gitignore`.

## Gotchas that have bitten before

- **Canonical domain is non-www** (`d4driving.co.uk`); www 301-redirects.
  Machine-readable URLs — sitemap, schema, hreflang — must all use non-www.
- **The mobile menu (`#mnav`) must live OUTSIDE `<nav>`.** The sticky nav's
  `backdrop-filter` creates a containing block that traps `position: fixed`
  descendants inside the 68px bar, making the menu invisible when scrolled.
- **GitHub Pages is case-sensitive.** `Rakesh.webp` ≠ `rakesh.webp`.
- **Cal.com is not Rakesh's only diary.** He also takes bookings through the
  Total Drive app, and those never reach Cal.com — so his feed shows far more
  free time than he really has. Never state a specific date or a count of open
  days for him; his page deliberately says only that he "usually has space" and
  sends people to WhatsApp to confirm. Robert's own Cal.com IS authoritative.
- **The YouTube subscriber count lives in 128 files.** Currently **32,000+**
  (updated 29 Aug 2026, was 25,000+). It appears twice in every article page's
  author bio and newsletter box, plus `index.html` (hero stat, about copy, the
  YouTube section, one FAQ answer) and `mock-test.html`'s og:description. The
  hero writes it as `32<span>k+</span>`, so a search for "32,000" misses it.
  Update with a global replace across `*.html`, and check `article-template.html`
  is included so new articles inherit the right number.
- **Article pages are static and hand-maintained.** Nothing regenerates them
  since Soro was cancelled. Re-run `tools/gen-articles.js` if articles change.
- **Availability comes from Cal.com via a Cloudflare Worker, not the GitHub
  Action.** `tools/availability-worker.js` (deployed to a `*.workers.dev` URL,
  set as `AVAIL_LIVE_URL` in `index.html`) proxies Cal.com's public
  `slots/getSchedule`, which is authoritative — it applies Robert's buffers and
  minimum notice, so it never offers a slot it would refuse to book. Cal.com
  sends no CORS headers, hence the proxy. The page fetches it per load, so the
  section is always live. `availability.json` is only the fallback now.
- **GitHub's `schedule` trigger cannot be relied on here — do not try to fix it
  with the cron expression.** The availability sync decayed from 23 runs/day to
  ~3 from 26 Aug 2026. Moving it off the hour (`0` -> `23`) was tried on 28 Aug
  and made no difference: gaps stayed at 5-18h, and GitHub ignores the requested
  minute entirely (runs land at :06, :11, :49). `created_at` == `run_started_at`
  on every run, so the runs are never created rather than queued and delayed.
  Not a quota - the repo is public, so Actions minutes are unlimited. Every run
  that does fire succeeds. If hourly freshness matters, trigger it externally via
  the `workflow_dispatch` API; the staleness banner on the page is the safety net,
  not the fix.
- **Bump the service worker cache version** (`sw.js`) on significant changes,
  or returning visitors keep the old assets.
- **48-hour booking notice lives in two systems** — `LEAD_HOURS` in
  `.github/workflows/blog-sync.yml` and Cal.com's own "Minimum Notice". Change
  one, change the other.
- **Deleting a code block:** read the whole region first. The Soro loader shared
  a `<script>` tag with the nav, burger and reveal JS; cutting to the closing
  tag destroyed all of it.

## Owner

Robert — prefers plain summaries, decisions laid out with a recommendation, and
being asked before structural changes. Claims must be true and checkable; he
has corrected overclaiming before.
