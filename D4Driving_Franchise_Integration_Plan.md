# D4Driving — Franchise Integration Plan
_Last updated: 2 August 2026_

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

**Rakesh's event type URLs:**

| Session | URL |
|---|---|
| Driving Assessment (90 min / £55) | `cal.com/rakesh-d4driving/driving-assessment` |
| 1-hr Lesson (£40) | `cal.com/rakesh-d4driving/1-hr-driving-lesson` |
| 1.5-hr Lesson (£55) | `cal.com/rakesh-d4driving/1.5-hrs-driving-lesson` |
| 2-hr Lesson (£75) | `cal.com/rakesh-d4driving/2-hrs-driving-lesson` |
| Peterborough Test Prep (4 hrs / £150) | `cal.com/rakesh-d4driving/peterborough-test-preparation` |

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

---

## Pending Tasks

| Item | Owner | Notes |
|---|---|---|
| **Electric Toyota C-HR+ launch** | Robert + Claude | Arriving early Sept 2026. Needs photos → fleet card, EV FAQ, schema, blog content. Claim wording: "first instructor in Peterborough teaching in the all-new electric Toyota C-HR+" (NOT "first electric car" — competitors use Leaf/Zoe/BYD) |
| **Rakesh's availability in `availability.json`** | Robert + Rakesh | Rakesh's iCal URL (from his public Google Calendar) needs adding to `blog-sync.yml`; add `instructor` field to each slot; update index.html display with instructor badge |
| **Cal.com T&C checkboxes** | Robert + Rakesh | Add required booking question to every event type: "I agree to D4Driving's Terms & Conditions: d4driving.co.uk/terms.html" |
| **Rakesh's Cal.com assessment price** | Rakesh | His 1.5hr assessment event displays no price — should show £45 |
| **Google review count in schema** | Robert + Claude | `aggregateRating` in index.html is a fixed number (36 at Aug 2026) — refresh every couple of months |
| **Rakesh's pricing on `index.html`** | Robert | Block packages for Rakesh not yet on main site pricing section — optional, his page covers it |
| **Orphaned file `vw-golf.webp`** | Robert | Old hyphen-filename version still in repo; safe to delete once confirmed unused |

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
- Hosting: **GitHub Pages** — CNAME → `www.d4driving.co.uk`, branch: `main`
- GitHub Pages runs on Linux → **case-sensitive filenames** (e.g. `Rakesh.webp` ≠ `rakesh.webp`)
- GitHub Action (`blog-sync.yml`) runs **hourly** — always `git fetch origin main && git merge origin/main` before pushing to avoid rejected pushes
- Formspree endpoint: `https://formspree.io/f/mwvzyrzz` (Robert's account, `info@d4driving.co.uk`)
- Cal.com embed (Robert): `calLink: "d4driving"`, `month_view`, inline
- Cal.com links (Rakesh): direct URL links, no embed
