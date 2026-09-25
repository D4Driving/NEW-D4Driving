# D4Driving — Franchise Integration Plan
_Last updated: 24 September 2026_

> **This is the build history** — what was done, when, and why. For a quick
> orientation at the start of a session, read `CLAUDE.md` instead: it is one
> page and covers where everything lives, what is in flight, and the rules.
> Business strategy, pricing and design docs are in the private
> `D4Driving/d4driving-ops` repo. See §16.

## Context

Robert (D4Driving founder) is expanding by taking on a franchisee named **Rakesh Kumar**.
Rakesh operates under the D4Driving brand, covering the same areas and test centres
(Peterborough, Grantham, Kettering). Students book through d4driving.co.uk.
Payments are handled separately — each instructor manages their own Stripe account.

---

## Agreed Decisions

| Topic | Decision |
|---|---|
| Brand | Rakesh operates under D4Driving brand |
| Area | Same coverage — Peterborough, Grantham, Kettering |
| Payments | Rakesh handles his own (separate Stripe) |
| Revenue split | Handled privately between Robert and Rakesh |
| Booking pages | Robert: Cal.com embed on index.html · Rakesh: separate `rakesh.d4driving.html` |
| Instructor selector | Two-card selector on index.html — Robert card (embed), Rakesh card (→ his page) |
| Student source | Rakesh brings some; Robert provides a few per month via website |
| Site presence | Rakesh on index.html (About + booking selector) and his own dedicated page |
| Booking platform | Cal.com — separate free accounts: `cal.com/d4driving` (Robert), `cal.com/rakesh-d4driving` (Rakesh) |

---

## Files Created / Modified

### New Files

| File | Purpose |
|---|---|
| `rakesh.d4driving.html` | Rakesh's dedicated booking page — bio, car, 5 session types, 4 block packages |
| `mock-test.html` | Free Mock Test signup page — form, consent, 4 YouTube videos |
| `mock-test-consent.html` | Print-ready consent & terms document |
| `Rakesh.webp` | Rakesh's photo (pencil sketch portrait) |
| `VW_Golf.webp` | Photo of Rakesh's white VW Golf |

### Modified Files

| File | Changes |
|---|---|
| `index.html` | Rakesh about section, two-card instructor selector, fleet updated (3 cars), hero copy, 21K+ subscriber count, Free Mock Test nav + hero button, availability window 30→45 days |
| `.github/workflows/blog-sync.yml` | `DAYS_AHEAD` 30→45, `MAX_SLOTS` 20→30 |

---

## 1. Cal.com Setup — ✅ Complete

- Robert: `cal.com/d4driving` (existing, unchanged)
- Rakesh: `cal.com/rakesh-d4driving` (set up by Robert/Rakesh)

**Rakesh's event type URLs** (current as of Aug 2026 — slugs were changed by Rakesh, the originals 404):

| Session | Price | URL |
|---|---|---|
| Assessment, 90 min (new students, once) | £45 | `cal.com/rakesh-d4driving/1.5-hrs-assessment-lesson-manual` |
| 1-hr Lesson | £42 | `cal.com/rakesh-d4driving/1-hour-driving-tuition-manual-car` |
| 1.5-hr Lesson | £60 | `cal.com/rakesh-d4driving/1.5-hrs.-driving-lesson-manual` (note the dot in "hrs.") |
| 2-hr Lesson | £80 | `cal.com/rakesh-d4driving/2-hours-driving-lesson` |
| Test Prep ×3 locations | £160 | Sold via **Stripe links**, not Cal.com — see section 12 |

**Robert's test prep event types:** `cal.com/d4driving/peterborough-test-preparation`, `/grantham-test-preparation`, `/kettering-test-preparation`

---

## 2. Booking Section (`index.html`) — ✅ Complete

Two-card instructor selector added above Robert's Cal.com embed:

- **Robert card** (active/highlighted) — Toyota Aygo X · Manual & Toyota Yaris Cross · Auto — shows "↓ Calendar below", triggers the existing Cal.com embed
- **Rakesh card** — VW Golf · Manual — links to `rakesh.d4driving.html`

---

## 3. About / Instructor Section (`index.html`) — ✅ Complete

- Robert's existing "Hi, I'm Robert" section unchanged
- Rakesh's section added directly below — slate badge "Also on the Team", bio, 5 bullet checks, "Book with Rakesh →" button → `rakesh.d4driving.html`
- Rakesh bio written and approved by Robert
- Badge: 18+ Months Teaching (slate colour)

---

## 4. `rakesh.d4driving.html` — ✅ Complete

> ⚠️ Prices below are the **original June 2026 build**. Superseded by the 1 Aug 2026 rollout (section 11) — semi-intensive dropped, 5hr block added, test prep in 3 locations. Current prices: §11 and `D4Driving_Pricing_Update_July2026.md`.

**Sections:**

1. **Header** — dark slate, pills: Peterborough / VW Golf · Manual / working hours / 5-month availability window
2. **About Rakesh** — photo (`Rakesh.webp`), 18+ month badge, bio, 5 ADI checks
3. **His Car** — `VW_Golf.webp`, car spec grid, pills: Dual Controls / Manual / White / 72-plate
4. **Featured session** — dark slate card: Peterborough Test Prep · 4 hrs · £150 · "Book Test Prep →"
5. **Individual sessions** — 4-column grid: Assessment, Standard 1hr, Extended 1.5hr (Most Popular), Long 2hr
6. **Block packages** — 4 cards: 10hr £380 / 15hr £540 (Most Popular) / 20hr £720 / Semi-intensive 21.5hr £800
7. **Availability note** — slate section, "View All Available Slots →" → `cal.com/rakesh-d4driving`

---

## 5. Fleet Section (`index.html`) — ✅ Complete

- Grid updated from 2 → 3 columns (responsive: 3 → 2 → 1)
- Heading: "Modern Tuition Vehicles"
- Added VW Golf card (Rakesh's car)
- Coverage eyebrow: "Where My Students Pass" → "Where Our Students Pass"
- Hero copy: "Brand-new Toyota dual-control cars" → "Modern dual-controlled cars"

---

## 6. Free Mock Test — ✅ Complete

- `mock-test.html` — standalone page with form (Formspree endpoint `mwvzyrzz`), 4 YouTube video embeds, how-it-works section
- `mock-test-consent.html` — print-ready 8-section consent document
- Nav link added (desktop + mobile burger): "🎯 Free Mock Test" in red
- Hero button added alongside "Free Starter Pack": "🎯 FREE Mock Test — Peterborough"

---

## 7. Availability System (`blog-sync.yml` + `index.html`) — ✅ Complete

- `DAYS_AHEAD` changed: 30 → **45**
- `MAX_SLOTS` changed: 20 → **30**
- Fallback messages in `index.html` updated: "30 days" → "45 days"
- Root issue (empty slots) resolved: Google Calendar made **public** → Action re-triggered → slots now showing ✅
- Current `availability.json`: 18 slots, generated 31 May 2026 16:59 UTC

---

## 8. Rakesh's Payments & Contact — ✅ Complete (June 2026)

- Stripe payment links live on `rakesh.d4driving.html` for all 4 block packages:
  10hr £380 · 15hr £540 · 20hr £720 · Semi-intensive £800
- Rakesh's phone/WhatsApp (07590 719888) on his page in all 3 locations

---

## 9. Legal Pages — ✅ Complete (June 2026)

- `terms.html` — T&Cs v2.0, all 19 clauses, Formspree electronic acceptance form (`form_type: terms_acceptance`), PDF download
- `privacy.html` — Privacy Policy v1.0, all 10 sections, retention table, GDPR rights cards, ICO callout
- T&C + Privacy links in footers of all pages
- Stripe: T&C URL + Privacy URL set at account level; "Require T&C acceptance" enabled on payment links

---

## 10. SEO / GEO Round — ✅ Complete (4 July 2026)

- `sitemap.xml` (111 URLs) + `robots.txt` — sitemap auto-regenerated hourly by `blog-sync.yml` (new Step 3)
- **Canonical domain is non-www** (`d4driving.co.uk`) — www 301-redirects on GitHub Pages; all machine-readable URLs (sitemap, robots, schema) use non-www
- Sitemap submitted to Google Search Console — Success
- Structured data on `index.html`: `DrivingSchool` schema with `AggregateRating` (5.0, 33 reviews) + `FAQPage` schema (8 Q&As)
- FAQ section (`#faq`) — 8 accordion Q&As; linked from nav, mobile menu, footer
- Sticky mobile "Book Now" bar — appears after hero scrolls out, hides while booking section is on screen
- Hero stats updated: 25k+ YouTube subs · 430+ local passes · 83% first-time pass rate (new stat)
- Reviews section expanded 3 → 6 Google reviews
- Schema phone corrected to mobile (07872 347686)

---

## 11. Pricing Rollout — ✅ Complete (1 August 2026)

Full detail in `D4Driving_Pricing_Update_July2026.md`. Both pages live with new prices, all Stripe/Cal.com links swapped, old links deactivated, FB announcement posted. Rakesh's structure differs deliberately: no semi-intensive, and test prep in all 3 locations sold via Stripe (Robert's test prep books through Cal.com).

---

## 12. PWA, Analytics & Competitor Monitoring — ✅ Complete (2 August 2026)

**Progressive Web App activated.** `manifest.json` and `sw.js` had existed in the repo since May but were never linked from any page, so the site was never actually installable. Now wired into index, rakesh, mock-test and both templates: SW registration, install button in the footer (`#pwa-install`) with an iOS Add-to-Home-Screen tip, plus favicons which had been missing site-wide. Two fixes made in passing — the service worker would have permanently cached `availability.json` (now network-first for all `.json`), and the cache version was bumped to `d4driving-v3`. **Bump this version on significant site changes** so returning visitors get fresh assets. There is no native app; "install the D4Driving app" in the YouTube videos refers to this.

**Cloudflare Web Analytics** (cookieless, free, token in `index.html`). Snippet sits before `</body>` on all 132 pages including the templates, so new articles inherit it. **No cookie consent banner is required** because it sets no cookies and does not track individuals — `privacy.html` §4, §5 and §9.3 document this. Limitation: pageviews only, no custom event tracking — booking conversion figures come from Cal.com and Stripe dashboards. YouTube video descriptions carry `?utm_source=youtube`; the canonical tags added on 1 Aug prevent those tagged URLs being indexed as duplicates.

**Competitor Watch agent.** Weekly cloud routine (Mondays 07:00 UTC) monitoring 20+ Peterborough driving schools, writing dated reports to the private repo `D4Driving/intelligence-report`. Needs a cloud environment with **Full** network access — the default "Trusted" level blocks outbound fetches. Baseline finding: market runs £35–44/hr, D4Driving's £37/hr block floor is the most competitive among quality schools, and no local competitor has EV positioning.

**Daily Doc Catch-up agent** (added 3 Aug 2026). Nightly cloud routine (~9pm UK) that reads the day's commits and appends a plain-English summary to `CHANGELOG.md`. It is a **backstop only** — the docs are normally updated during the working session. It ignores the hourly `D4Driving-Bot` sync commits, writes nothing at all on quiet days, and is restricted to `CHANGELOG.md` alone: it must never edit this plan doc or any site file. Entries it marks with ⚠ are work not yet reflected here and should be folded in.

---

## 13. Polish Landing Page — ✅ Live 3 August 2026 (proofread and approved by Robert)

`nauka-jazdy-peterborough.html` — a Polish-language landing page. Robert speaks Polish and serves Peterborough's large Polish community, but the website never mentioned it. No local competitor advertises Polish (one advertises Romanian), and unlike pricing or pass-rate claims a rival cannot copy this without employing a Polish speaker.

**Audience (confirmed by Robert):** primarily **parents** unfamiliar with the UK licensing system, and Polish adults who want to learn to drive here. Polish teenagers in Peterborough generally speak better English than Polish, so the student-facing content is a short practical block, not half the page.

**Structure:** first-person Polish hero ("Jestem Polakiem. Uczę jazdy tutaj od 2017 roku.") → proof strip → **five-step explanation of how to get a UK licence** (provisional, theory, lessons, practical, full licence) which is the page's spine → split panel, "Dla rodziców" (weighted) and "Pierwsza lekcja" (short) → prices → real Google reviews left in English for verifiability → eight-question Polish FAQ → booking CTA.

**Claims discipline:** DVLA/DVSA fees are *not* stated, only linked to gov.uk, so the page cannot go stale or mislead. D4Driving's own prices are stated because they are product truth.

**SEO:** reciprocal `hreflang` (pl / en-GB / x-default) on both this page and `index.html`, self-canonical, Polish `FAQPage` JSON-LD, `og:locale pl_PL`, sitemap priority 0.9, and a language switch (nav pill above 1140px, mobile menu and footer at every width).

**Status:** Polish proofread and approved by Robert. Remaining is promotion only — Search Console submission, Peterborough Polish Facebook groups, and possible Polish-language blog content. It routes to Robert only; Rakesh's languages are not established.

---

## 14. Booking Notice & Nav Changes — ✅ 3 August 2026

**48-hour minimum notice.** The advertised availability list no longer shows anything sooner than 48 hours out (`LEAD_HOURS` in `blog-sync.yml`, rolling and rounded up to the next whole hour). Tested across weekday, Friday-evening, Saturday and Sunday starts — the Friday case correctly rolls past the closed Sunday to Monday morning. **Cal.com's own "Minimum Notice" has been set to 48h by Robert**, so the website and the booking system now agree; these are two separate systems and must be kept in step if either changes.

**Nav simplified.** The red "Book Online" CTA was removed from the navigation bar on all pages (it appeared under four labels: "Book Online", "Book Now", "Book with Rakesh", "Umów lekcję"). Booking remains available via the hero CTA, price cards, mobile sticky bar, mobile menu and footer. A 🇵🇱 language switch now sits in the bar at every width, sized to a 44px touch target; it falls back to the letters "PL" on platforms without flag glyphs.

---

## 15. Soro Decommissioned — ✅ 20 August 2026

Soro was cancelled (cost). Everything that depended on it has been removed.

**Homepage "Driving Tips" section.** It was the last component still wired to the feed, and it had two faults: its cards linked to `article.html?i=N` — **a file that never existed in the repo, so every card 404'd** — and when the feed didn't respond the grid sat on "Loading articles…", collapsing the section so anchor links appeared to land in the wrong place. It now reads `articles.json` from this repo (125 entries, real article URLs), generated by `tools/gen-articles.js` from `blog.html`. Re-run that script by hand if articles ever change.

**Anchor offset.** Separately, every in-page anchor scrolled section headings underneath the 68px fixed nav. `scroll-padding-top: 88px` added to the six pages with a fixed nav.

**The hourly Action.** `blog-sync.yml` fetched the cancelled feed and regenerated `blog.html` plus every article page each hour — which also meant **any manual edit to an article was overwritten within the hour**. That step is removed. The workflow is renamed **"Availability & Sitemap Sync"** (same file path, so run history is preserved) and now does only availability + sitemap. This also closes a real risk: availability generation ran in the *same job*, so when the feed finally went dark the failure would have stopped live availability slots updating. The commit step now stages `availability.json` and `sitemap.xml` explicitly rather than `git add .`.

**Article pages are now fully static and hand-maintained.** Nothing regenerates them.

---

## 16. Documentation Consolidated — ✅ 20 August 2026

Work on this site was spread across enough places that it had started costing
real money: a fix was built from scratch in August that a forgotten branch had
already solved, better. The cause was not missing documentation — it was that
nothing was read *automatically* at the start of a session.

**`CLAUDE.md` at the repo root** is the fix. It is loaded every session without
being asked for, so it is deliberately kept to about a page: where each document
lives, what work is in flight, the standing rules, and the handful of gotchas
that have actually bitten (non-www canonical, the mobile menu's `backdrop-filter`
trap, case-sensitive Pages hosting, the hourly Action's push races). Anything
longer belongs elsewhere — length is what makes an auto-read file get skimmed.

**One private repo for everything internal.** `D4Driving/intelligence-report`
was renamed **`D4Driving/d4driving-ops`** and now holds:

| Path | What moved in |
|---|---|
| `product/` | PRODUCT.md, DESIGN.md, Design_Critique_2026-05-03.md |
| `business/` | Pricing update (+PDF), Launch Kit, Project Instructions |
| `plans/`, `specs/`, `LESSON-LEDGER-STATE.md` | Absorbed from the separate `D4Driving-internal-docs` repo |
| `competitors.md`, `reports/` | Unchanged, so the weekly routine kept working |

Seven of those documents had been gitignored out of this public repo and were
therefore **in no version control at all** — no history, and nothing if the
machine were lost. They now have both.

The nested `docs/superpowers/` checkout inside this repo's working tree is gone.
It was the hazard behind the `git add -A` accident that staged a private repo
into a public commit; its contents live in the ops repo instead.

**Both cloud routines repointed.** The weekly competitor watch now targets the
renamed repo and stages explicit paths instead of `git add -A`, since the repo
holds unrelated documents now. The nightly doc catch-up additionally reconciles
`CLAUDE.md` — it may retire an In-flight row when work demonstrably lands, and
otherwise flags staleness rather than editing.

**Branches tidied.** `blog-decouple-from-soro` deleted (fully merged); local-only
`master` deleted (a May commit superseded by main — identical photo, and it still
said 16,000 subscribers). `lesson-credit-ledger` left alone; it is live work.

**One incidental fix.** A real, unverified UK mobile number was serving as the
`e.g.` value in the ledger schema docs. Replaced with Ofcom's reserved fiction
range (`+447700900123`). It remains in the old `D4Driving-internal-docs` history,
which is private and can be left, or the repo deleted outright — Robert's call.

---

## 17. Availability Feed Went Stale — ✅ 28 August 2026

**Symptom:** Robert noticed the Next Available Slots section was not refreshing.

**Root cause: GitHub stopped firing the hourly schedule.** The workflow itself
was healthy the whole time — every run green, and a manual dispatch finished in
10 seconds. The trigger was the problem. The cron sat on `0 * * * *`, and GitHub
documents `schedule` as best-effort with **the start of every hour** as its
highest-load window; runs there get delayed or dropped. The decay was sharp:

| Date | Runs |
|---|---|
| 15–25 Aug | 23/day (hourly, correct) |
| 26 Aug | 17 |
| 27 Aug | 3 |
| 28 Aug | 1 |

Nothing in the repo changed to cause it — there were no non-bot commits between
24 and 28 August. It was not the 20 August rewiring, which ran cleanly for five
days afterwards.

**What it actually cost.** Not a blank section — confident wrong answers. The
manual re-run removed three slots (4, 11 and 15 September) that were already
booked. The site had advertised them as free for 11½ hours, under a pulsing
"Available" badge and the words "pulled live from Robert's diary".

**Fixes:**

- **`blog-sync.yml`** — cron moved to `23 * * * *`, off the contended slot.
- **Staleness is now declared.** Past 3 hours the timestamp turns red and a
  banner reads "These times were last checked N hours ago, so some may already
  be taken." Under 3 hours nothing changes. GitHub can still drop runs; this
  makes that visible rather than silent, which is the part that actually
  protects students. Durations also read as "11 hours" now, not "688 min".
- **Day-grouping bug.** Slots were grouped by *weekday name*, so a second
  Friday was filed under the first Friday's heading — 19 slots were rendering
  beneath 16 headings, with 11 Sep sitting under "Friday, 4 Sep". Now keyed on
  the calendar date.
- **Service worker.** The network-first rule for `.json` tested the whole URL,
  but the page requests `availability.json?t=<timestamp>`, which does not end in
  `.json`. The rule never matched, so those requests took the cache-first path
  and wrote a **new, permanently-retained cache entry on every page view**. Now
  tests the pathname; cache bumped to `v5` to purge what accumulated.
- **Deleted `blank.yml`**, the stock "Hello, world!" starter workflow, which
  fired a runner job on every push — including all ~23 daily bot commits.

### Working hours were being applied in the wrong timezone

Found while confirming the feed was accurate. The hours are declared `9-19`, but
GitHub runners are UTC and `setHours()`/`getDay()` resolve against the process
timezone — so every summer the window silently became **10:00-20:00 BST**. The
9am hour was invisible to the slot finder, and the calendar shows **24 lessons
starting at 9am** over the next 45 days, so it is prime time. Saturdays shifted
the same way, advertising 5-6pm past the 17:00 finish.

Fixed by pinning `TZ: Europe/London` on the job, which also handles the GMT/BST
switch instead of being right for half the year. Slot dates are no longer
labelled from `toISOString()` either — that is UTC, so a run during the
00:00-01:00 BST hour would have dated slots to the previous day.

Separately, the declared hours did not match reality: `end: 19` means the last
lesson *finishes* at 7pm, so a 7pm start could never be advertised — yet the
calendar had 15 of them. Robert confirmed his actual hours on 28 Aug 2026:
**weekdays 9am-8pm, Saturdays 10am-5pm**. Weekdays widened to `end: 20`;
Saturday already matched.

Verified live: earliest offered start moved from 10:00 to **09:00**, and the
site now shows a 9 Oct slot at 9:00am-12:30pm that the old window could not see.

**Still unproven at time of writing:** the new cron had not yet fired. GitHub's
scheduling is not observable from outside, so moving off `:00` is the documented
lever, not a guarantee. The staleness banner exists precisely because it may
not be enough.

---

## 18. Availability Moved to Cal.com — ✅ 29 August 2026

**The cron fix from §17 did not work.** Three days of data: still ~3 runs/day
against an hourly cron, gaps of 5–18h, and GitHub ignoring the requested minute
entirely (runs landed at :06, :11, :28, :49). `created_at` == `run_started_at`
on every run, so the runs are never *created*, not queued and delayed. Not a
quota — the repo is public, so Actions minutes are unlimited. Every run that
does fire succeeds. No cron expression will fix this.

**Cal.com is also the better source.** Its public `slots/getSchedule` endpoint
needs no auth and returns Robert's real bookable slots, already accounting for
his buffers, minimum notice and Cal.com schedule. Deriving free gaps from the
raw Google Calendar only approximates that — it was advertising 28 Sep and
6 Oct, which Cal.com has no bookable slot for at all. Students would have
clicked through to nothing.

**Cal.com sends no CORS headers** (verified: 204, no `access-control-allow-origin`),
so the page cannot call it directly. `tools/availability-worker.js` is a
Cloudflare Worker that fetches it server-side and re-serves it with CORS, in the
same shape `availability.json` already uses. It merges consecutive bookable
start times into blocks (08:00, 09:00, 10:00 → one 08:00–11:00 block), so the
existing card design is unchanged.

Fetching per page load means the section is always live and GitHub's scheduler
stops mattering.

**Live.** Worker deployed by Robert at
`https://fancy-dream-5431.fancy-surf-7864.workers.dev/`, wired up via
`AVAIL_LIVE_URL` in `index.html`.

Verified end to end: the page fetches only the Worker, reports "Updated just
now", and the two phantom days (28 Sep, 6 Oct) that Cal.com will not book are
gone. Forcing the Worker to fail falls back to `availability.json` and still
renders every slot, so an outage degrades to slightly-stale rather than to
nothing.

`blog-sync.yml` still runs — it generates the sitemap, and `availability.json`
is now the fallback source. Its unreliable schedule no longer matters, because
nothing time-critical depends on it.

---

## 19. Slot Cards Book Directly on Cal.com — ✅ 29 August 2026

Tapping a slot opened WhatsApp, so every booking needed Robert in the loop.
The cards now lead with **Book this slot** into Cal.com, which takes the booking
and the payment; **or message Robert** stays underneath for anyone who would
rather talk first — Robert's call, so nobody hits a payment wall with no
alternative.

**Two link shapes, because the cards show ranges.** A card covering a single
hour deep-links straight to the booking form with that time locked in
(`?month=&date=&slot=`). A card covering several hours links to that day's time
picker instead (`?month=&date=`) — a card reading "9:00am–1:00pm" covers four
bookable hours, and sending someone to a fixed 9am form would contradict it.
Verified live: the 25 Sep "1:00pm–3:00pm" card lands on a picker offering
exactly 1:00pm and 2:00pm.

**New students.** Slots are computed for the 1-hour lesson (£42), which is the
wrong product for someone who has never driven — they need the 90-minute
assessment (£45). The site cannot know which is which, so the footer now points
them there rather than silently selling the wrong thing.

### 1 hour and 1.5 hours, via a duration toggle

Cal.com slots each duration against its **own** interval, so the times genuinely
differ — on 16 Sep the 1-hour slot is 11:00 but the 1.5-hour is 10:30. They
cannot share a card. Rather than put a second button on every card (they are
already tall), the page shows a duration toggle above the grid and swaps the
whole list; switching re-renders from data already fetched, with no second
request.

1.5 hours fits on **11 of the 12 days** that have any availability, so it was
worth surfacing rather than leaving people to find it on Cal.com. The 2-hour
lesson fits on 6 days — add `2-hrs-driving-lesson` to `DURATIONS` in the Worker
to offer it too.

The Worker fetches both durations in parallel and returns them as `options`,
keeping the flat `slots` array as the 1-hour list so the fallback file and any
cached older page keep working. The page synthesises a single 1-hour option
when `options` is absent, and hides the toggle when there is only one choice —
so the page change was safe to ship before the Worker was redeployed.

Prices are deliberately **not** shown on the cards. Cal.com charges £42 and £60
and displays that at the point of booking; repeating it on the site would be a
second source of truth to drift.

**Accessibility.** "Book this slot" repeats on all 13 cards, so each link
carries an `aria-label` naming its real date and time; the button is a 44px
touch target with a visible focus ring.

---

## 20. 2-Hour Lessons, and Rakesh's Availability — ✅ 29 August 2026

**Robert now offers 1, 1.5 and 2 hours.** The 2-hour lesson fits on 6 of the
next 45 days, so it earns its place in the toggle.

**The Worker serves either instructor.** Durations are per-instructor because
the two Cal.com accounts use different slugs — Rakesh renamed his, and his
1.5-hour one contains a literal dot (`1.5-hrs.-driving-lesson-manual`). It takes
an `?instructor=` param, defaults to Robert so the existing call keeps working,
and echoes the account back so the page builds booking URLs against the right
one. Both accounts also have a 90-minute assessment event, deliberately kept out
of the duration list — different product, linked separately.

**Rakesh got a different treatment, deliberately.** His Cal.com returns
09:00–18:00 free on **38 of the next 45 days** — the only busy time in five
weeks is a 12:00–13:00 gap on two Mondays. Rendering that the way Robert's page
does would have been 30 near-identical all-day rows, which reads as an empty
diary rather than as availability, and sits badly next to Robert's 13 fragmented
blocks. Worth revisiting if his Cal.com is ever connected to a fuller diary.

So his panel carries one honest line instead — *"Rakesh can next take a lesson
on Monday 31 August, with openings on 38 of the next 45 days"* — above the
booking-page link that was already there. His page already has four priced
lesson cards linking into Cal.com, so a grid would have duplicated them.

To make that claim accurate, the Worker returns `daysAvailable` counted BEFORE
the 30-block cap, rather than a number that reflects how much we happen to
render. The line is hidden unless the fetch succeeds, so a Worker outage costs
nothing — the static copy stands on its own.

**Softened same day, once Robert confirmed why the diary looked empty:** Rakesh
also takes bookings through the **Total Drive app**, and those never reach
Cal.com. So the feed is a reliable signal that he has room, but not proof that
any particular slot is free — naming a date, or counting open days, was a
promise it could not keep, and a student could have booked a slot already
filled elsewhere.

The feed now only picks which soft phrasing to use — *"space within the next
few days"* when the earliest slot is inside a week, *"availability over the
coming weeks"* otherwise — and the line always sends people to WhatsApp to
confirm. It still hides entirely when he has nothing free or the Worker is
unreachable.

This keeps the genuinely useful part (he has room, and Robert's next slot is
weeks out) without asserting a slot is bookable. `daysAvailable` stays in the
Worker — unused by the page now, but the honest number if a future page wants
it.

---

## 21. Subscriber Count Raised to 32,000+ — ✅ 29 August 2026

The channel passed 32K, so the site's 25,000+ was understating it. Replaced
across **128 files / 257 occurrences**: every article page carries it twice (the
author bio and the newsletter box), plus `index.html` in four places and
`mock-test.html`'s og:description.

Two traps worth knowing. The hero stat is written `25<span>k+</span>`, so a
search for "25,000" misses it entirely. And `article-template.html` had to be
updated too, or the next generated article would have reintroduced the old
number. Both are noted in `CLAUDE.md`.

Done as a byte-level replace so the files kept their existing line endings —
the diff is 257 insertions and 257 deletions with nothing else touched.

---

## 22. Homepage Reordered — ✅ 1 September 2026

Robert reordered the page around price and availability first, proof second,
who-and-what third.

| # | Section | | # | Section |
|---|---|---|---|---|
| 1 | Hero | | 8 | Meet Our Instructors |
| 2 | Status bar | | 9 | Rakesh (separate block) |
| 3 | Lesson Prices | | 10 | Peterborough & Beyond |
| 4 | Next Available Slots | | 11 | Recent Passes |
| 5 | Choose Your Instructor | | 12 | YouTube |
| 6 | Google Reviews | | 13 | Driving Tips |
| 7 | Tuition Vehicles | | 14 | Theory promo, FAQ, Contact |

**Hero buttons:** Earliest Availability (primary red, → availability), See
Prices, Book Online, Call. The **AI receptionist number is retired** — it
appeared exactly once on the whole site, in the button this replaced. The hero
now calls Robert's mobile, matching the `tel:07872347686` format used in the
other 394 places.

**Method.** The file was split on its `<!-- ═══ NAME ═══ -->` markers and
verified to reassemble **byte-identically** before anything moved, so only the
order changed. Two blocks are easy to miss: the status bar is a bare `div`, not
a section, and Rakesh's instructor block is separate from "Meet Our
Instructors" — they must move together.

**Backgrounds had to be redone.** Sections alternate two shades, and reordering
left same-shade sections butting together with no seam. Re-alternated the whole
run; verified zero adjacent clashes. Note `#fleet` had no inline background at
all (it relied on the `.sec` default), so it needed one adding.

**Cosmetic issues found at launch:**

- **Resolved the same day:** on desktop the four hero buttons needed two rows —
  657px plus gaps in a 680px column. Shortening the call button's label to
  "Call Robert" (commit 6a1afbc) fits them on one row with 34px to spare. On
  mobile they stack as four full-width buttons.
- `#prices` is **6,604px tall** and now sits first, so there is a long scroll
  before anything else. Worth watching if reviews start getting less attention.

---

## 23. Electric Toyota C-HR+ Launch — ✅ 20 September 2026

Robert's automatic car changed from the Toyota Yaris Cross to a **fully
electric Toyota C-HR+**, 2026 (76) plate, collected 20 September. The website
launched the same day.

**Positioning — read this before touching the copy.** The ops notes record
that Robert rejected *"first electric driving school car in Peterborough"* as
overclaiming (Elliott's runs a Nissan Leaf) and narrowed it to the defensible
claims. Nine weekly competitor checks through 7 Sep 2026 showed nobody in
Peterborough promotes an EV on their homepage, so being first to *say* it is
the position. The two claims used are **"one of very few electric tuition cars
in the city"** and **"the first C-HR+ teaching in Peterborough"**. The angle is
future-proofing: with new petrol and diesel cars phased out from 2030, the car
you pass in is the car you'll drive. Robert chose to keep the 2030 date.

**Where it went**, loudest first: the red status bar became the launch banner;
the hero subheading names the car; the fleet card was rewritten with an
*Electric* pill; a new FAQ carries the full argument in both the visible
accordion and the FAQPage schema; the instructor selector, contact dropdown,
alt text and meta description were updated. "electric driving lessons
Peterborough" is a search no competitor is contesting.

**Photo.** Robert's own shot on collection day, cropped to the Yaris file's
1.45 ratio so the hero and fleet card crop it identically, resized to 1080
wide. The phone's "AI-generated content" corner label — which the Yaris photo
had carried on the live site all along — was cropped out. 22 references
across 11 files, including the og:image on every page, so shared links
preview the new car. `yaris-cross.webp` is left in place, unreferenced,
because social platforms cache og:image by URL; delete once old shares age
out. The Toyota press render Robert also sent is unused — it doesn't match
the real-photo style of the other two fleet cards.

**Done as a branch** (`chr-plus-launch`) so the text could be written and
approved on 18 Sep without the site ever saying C-HR+ while still showing the
Yaris. Merged the moment the photo was in.

**Worth doing later:** the C-HR+ has no D4Driving roof sign in the photo (it
was taken at the dealership). A photo with the sign fitted would match the
Aygo X card better.

---

## 24. Logo No Longer Overlaps the Tagline on Phones — ✅ 12 September 2026

On a 375px phone the D4Driving logo sat on top of the "Peterborough's Most
Trusted Driving School" tagline. The cause was the hero centring its content
vertically in a full-height screen with no top padding. On desktop the content is
short, so centring lands it well below the fixed nav. On a phone the four stacked
buttons and two guide links nearly fill the screen, so centring pushed the
tagline up to 35px — underneath the 92px nav. Measured overlap: 32px vertical,
54px horizontal.

Fixed by reserving the nav's height as top padding on burger-menu widths
(`#hero { padding-top: 100px }` inside the existing 960px breakpoint), so
centring can never place content behind the nav. Desktop is untouched by
construction: its padding stays 0 and the tagline sits at exactly the same
position (173px). Commit 859e167.

---

## 25. Broken Wix-era Links Fixed — ✅ 25 September 2026

Article bodies still linked to Wix-era addresses — `/post/…`, `/service-page/…`,
`/news/…` and five old extensionless slugs — which all 404 on GitHub Pages.
**54 links on 19 pages** now point at live pages. The other **27** sit inside the
23 location pages' article bodies and are left for the local SEO rewrite, which
fixes them page by page (Robert's call, 25 Sep).

**Robert approved the mapping before it shipped:**

| Kind | Links | Now points to |
|---|---|---|
| Same article, new address | 21 | That article |
| Old booking page (`/service-page/…`) | 10 | `index.html#prices`, which prices all three test-prep centres, the assessment and the 1- and 1.5-hour lessons |
| Old article gone | 11 | The nearest current article |
| Old target didn't fit the linked words | 12 | A page that fits the words. For example, a heading "How long should your first lesson be?" had linked to an article on how many lessons you need |

No link had to be removed. New links use the canonical
`https://d4driving.co.uk/<page>.html`, so they skip the www redirect.

**Method.** Each exact `<a href="…">` was replaced byte for byte, and each had to
occur exactly once in its page, so line endings and every other byte stayed put:
53 lines changed, since two links share a line. A separate checker parsed every
changed page against the committed version. It confirmed that only those 54
hrefs changed, every target exists, `#prices` exists and no page links to
itself. A full rescan then found no broken internal links outside the 27 held
back.

**Traps worth knowing:**

- **The location pages hold 27 broken links on 10 pages, not 26 on 9.** One is
  written `https://Www.d4driving.co.uk/tips.html`, with a capital W, and
  `tips.html` never existed. Host names are case-insensitive, so a link checker
  must lowercase the host before deciding whether a link is internal. The local
  SEO plan's checker doesn't yet (noted in `LOCAL-SEO-STATE.md`).
- **Two false positives for a naive grep:** the `ARTICLE_SLUG` link in
  `article-template.html` is a placeholder by design, and the hrefs inside
  `index.html`'s `<script>` blocks are code, not links.

---

## Pending Tasks

| Item | Owner | Notes |
|---|---|---|
| **Local SEO — real links + genuinely local pages** | Robert + Claude | Spec and 17-task plan in the private ops repo (`specs/` and `plans/2026-09-24-local-seo*`). Awaiting Robert's OK on five plan changes and a go. Resume from `LOCAL-SEO-STATE.md` in the ops repo. The 23 location pages' article bodies will be rewritten — don't edit them in other work |
| **404 page and old-URL redirects** | Robert | There's no `404.html` yet, so a dead address shows GitHub's bare error page with no way back to the site. Recommended: a branded 404 page (add it to the sitemap workflow's `EXCLUDE` list). Add redirect stubs only for old `/post/` and `/service-page/` URLs that Search Console's *Not found (404)* report shows are still requested (see §25). His decision |
| **Sitemap `lastmod` dates** | Robert | Optional: have the sync workflow add each page's last-changed date (local SEO plan, Task 17). His decision |
| **Cal.com T&C checkboxes** | Robert + Rakesh | Add required booking question to every event type: "I agree to D4Driving's Terms & Conditions: d4driving.co.uk/terms.html" |
| **Rakesh's Cal.com assessment price** | Rakesh | His 1.5hr assessment event displays no price — should show £45 |
| **Google review count in schema** | Robert + Claude | `aggregateRating` in index.html is a fixed number (36 at Aug 2026) — refresh every couple of months |
| **Rakesh's pricing on `index.html`** | Robert | Block packages for Rakesh not yet on main site pricing section — optional, his page covers it |
| **Orphaned file `vw-golf.webp`** | Robert | Old hyphen-filename version still in repo; safe to delete once confirmed unused |
| **Retired image `yaris-cross.webp`** | Claude | Unreferenced since the C-HR+ launch, but kept so old social-media shares still show a preview. Safe to delete from about late October 2026 |

---

## Brand Tokens (reference)

| Token | Value |
|---|---|
| Red | `#BD2026` |
| Red hover | `#d4252c` |
| Slate | `#2C3E50` |
| Sage | `#8FA3A0` |
| Background | `#fbfdff` |
| Background 2 | `#f3f7fb` |
| Font | Plus Jakarta Sans |
| Border radius | 16px |
| Glass card | `backdrop-filter: blur`, `rgba` white bg |

---

## Architecture Notes

- All pages: **single-file HTML with inline CSS/JS** — no build tools, no bundler
- Hosting: **GitHub Pages** — `CNAME` contains `d4driving.co.uk`, branch: `main`
- **Canonical domain is non-www**; `www` 301-redirects to it. Every machine-readable URL — sitemap, schema, hreflang, canonical tags — must use the bare domain. Getting this wrong is what made Search Console report "couldn't fetch" for the sitemap in July 2026
- GitHub Pages runs on Linux → **case-sensitive filenames** (e.g. `Rakesh.webp` ≠ `rakesh.webp`)
- GitHub Action (file `blog-sync.yml`, now named **"Availability & Sitemap Sync"**) runs **hourly** — always `git fetch origin main && git merge origin/main` before pushing to avoid rejected pushes
- Formspree endpoint: `https://formspree.io/f/mwvzyrzz` (Robert's account, `info@d4driving.co.uk`)
- Cal.com embed (Robert): `calLink: "d4driving"`, `month_view`, inline
- Cal.com links (Rakesh): direct URL links, no embed
