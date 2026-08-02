# D4Driving — Pricing Update Plan (July 2026)

_Status: **STAGED — nothing changed on the website yet.** Awaiting new Stripe links._
_Rollout approach agreed: everything prepared in advance, pushed live on the effective date (Option B)._

## ⭐ Effective date: **1 August 2026**

First price rise since **2022**.

---

## 1. Agreed New Prices

Applies to **both instructors** (Robert and Rakesh — identical pricing).

### Pay-As-You-Go

| Lesson | Current | New | Effective rate | Notes |
|---|---|---|---|---|
| Assessment (90 min) | £55 | **£45** | £30/hr | **Once per student · new students only** — must be visible on the card |
| 1 Hour | £40 | **£42** | £42/hr | |
| 1.5 Hours | £55 | **£60** | £40/hr | |
| 2 Hours | £75 | **£80** | £40/hr | |

### Block Bookings (per-hour rate steps down at every tier)

| Block | Current | New | Per hour | Saving vs £42/hr PAYG |
|---|---|---|---|---|
| **5 hrs — NEW TIER** | — | **£200** | £40.00 | £10 |
| 10 hrs | £380 | **£390** | £39.00 | £30 |
| 15 hrs | £540 | **£560** | £37.33 | £70 |
| 20 hrs | £720 | **£740** | £37.00 | £100 |
| Semi-Intensive (21.5 hrs + test prep) | £800 | **£840** | £39.07 | Premium package |

### Test Preparation Sessions (4 hrs)

| Session | Current | New | Offered by | Notes |
|---|---|---|---|---|
| Test Prep — Peterborough | £150 | **£160** | Robert + Rakesh | Full 4 hrs of training |
| Test Prep — Grantham | £150 | **£160** | Robert only | 4-hr slot incl. ~1 hr travel each way → ~2 hrs training at the test centre area |
| Test Prep — Kettering | £150 | **£160** | Robert only | 4-hr slot incl. ~1 hr travel each way → ~2 hrs training at the test centre area |

**New for the website:** test prep gets its own glass cards in the index.html pricing section (currently not shown there at all). Rakesh's page already shows his Peterborough test prep — price updates to £160.

Headline rate for badges: **"From £37/hr"** (lowest effective block rate — 20 hr block).

---

## 2. Website Changes (Claude — staged, pushed on effective date)

### index.html — ✅ LIVE 1 Aug 2026 (commit 204defb)
- [x] Assessment card: £45 + "One per student — new students only"
- [x] Lesson cards: 1hr £42 · 1.5hr £60 · 2hr £80
- [x] Block grid: 5 hrs / £200 card added (5-column grid) + per-hour rate on each card
- [x] Block prices: £390 / £560 / £740 / £840
- [x] Test Prep glass cards ×3 with approved wording, linked to Robert's Cal.com event types
- [x] Booking badge + sticky mobile bar: "From £37/hr"
- [x] FAQ answer + FAQPage JSON-LD updated with all new prices
- [x] Robert's 5 new Stripe links live

### rakesh.d4driving.html — ✅ LIVE 1 Aug 2026 (commit 5084aca)
- [x] Assessment £45 + "One per student — new students only"
- [x] Session prices: 1hr £42 · 1.5hr £60 · 2hr £80
- [x] **Plan change:** Rakesh dropped the semi-intensive; blocks are 5/10/15/20 hrs (£200/£390/£560/£740), new Stripe links
- [x] **Plan change:** Test prep now in all 3 locations (Peterborough featured / Grantham / Kettering), £160 each, sold via **Stripe links** (not Cal.com like Robert's)
- [x] Meta description updated

### After go-live
- [ ] Update memory file `robert-pricing.md` + this doc marked complete
- [ ] Check Soro blog articles that mention prices (e.g. driving-lesson-prices article) — flag to Soro if stale

---

## 3. Robert's Tasks (before go-live)

### Stripe — Robert's account (5 new payment links needed)
| Package | Price | Status |
|---|---|---|
| 5 hrs | £200 | ⬜ NEW — create product + link |
| 10 hrs | £390 | ⬜ new link |
| 15 hrs | £560 | ⬜ new link |
| 20 hrs | £740 | ⬜ new link |
| Semi-intensive 21.5 hrs | £840 | ⬜ new link |

Remember on each new link: **"Require customers to accept your terms of service"** checkbox.
Keep old links live until go-live day (site still points at them), then deactivate.

### Stripe — Rakesh's account (same 5 links at same prices)
| Package | Price | Status |
|---|---|---|
| 5 hrs | £200 | ⬜ NEW |
| 10 hrs | £390 | ⬜ |
| 15 hrs | £560 | ⬜ |
| 20 hrs | £740 | ⬜ |
| Semi-intensive 21.5 hrs | £840 | ⬜ |

### Cal.com — on go-live day (1 Aug 2026)
| Event type | New price | Robert | Rakesh |
|---|---|---|---|
| Assessment (90 min) | £45 | ⬜ | ⬜ |
| 1 hr lesson | £42 | ⬜ | ⬜ |
| 1.5 hr lesson | £60 | ⬜ | ⬜ |
| 2 hr lesson | £80 | ⬜ | ⬜ |
| Test Prep — Peterborough (4 hrs) | £160 | ⬜ | ⬜ |
| Test Prep — Grantham (4 hrs) | £160 | ⬜ (create event type if missing) | — |
| Test Prep — Kettering (4 hrs) | £160 | ⬜ (create event type if missing) | — |

---

## 4. Open Items

1. ~~Effective date~~ ✅ **1 August 2026** — everything flips on this day: site push + Cal.com edits + old Stripe links deactivated.
2. ~~Rakesh's Test Prep~~ ✅ **£160** — all test prep sessions £160 (Robert: Peterborough/Grantham/Kettering; Rakesh: Peterborough only).
3. **New Stripe URLs** — Robert to send all 10 links (5 his, 5 Rakesh's) once created; Claude stages them into the HTML. *(Awaiting — "will be provided later")*
4. **Grace period** — existing pre-purchased blocks remain valid at what was paid (no action). The FB post gives everyone notice to buy at current prices before 1 August.
5. ~~Grantham/Kettering card wording~~ ✅ **Approved:** "4-hour session — includes travel to/from Grantham [/Kettering]; approx. 2 hours' training on local test routes."
6. ~~Robert's Cal.com test prep event types~~ ✅ **URLs received:**
   - Peterborough: `https://cal.com/d4driving/peterborough-test-preparation`
   - Grantham: `https://cal.com/d4driving/grantham-test-preparation`
   - Kettering: `https://cal.com/d4driving/kettering-test-preparation`
   - Rakesh's card uses his existing `cal.com/rakesh-d4driving/peterborough-test-preparation`.
7. ~~Stripe test prep prices~~ ✅ Correction: test prep is booked via **Cal.com only** (no Stripe products). Cal.com prices updated to £160 on 1 Aug.

## Go-live status — 1 August 2026
- ✅ index.html live with all new prices + Robert's 5 new Stripe links
- ✅ Robert: old Stripe links deactivated
- ✅ Robert: Cal.com prices updated (lessons + test prep £160)
- ✅ FB announcement posted
- ✅ Rakesh's page live with his 7 new Stripe links (4 blocks + 3 test prep)
- ⬜ Rakesh: update Cal.com prices (£45/£42/£60/£80) + deactivate his 4 old Stripe links

---

## 5. Facebook Announcement Post (draft)

> **📢 A quick heads-up from D4Driving — our first price change since 2022**
>
> We've held our prices for four years. In that time the cost of fuel, insurance and keeping a modern dual-control fleet on the road has climbed relentlessly — so from **1 August 2026**, our prices are going up for the first time since 2022. We've restructured things so that committed learners actually get **better value than before**.
>
> **What's changing from 1 August:**
> 🚗 Lessons from £42/hr (90-min and 2-hr options available)
> 📦 Block bookings now start at just 5 hours — £200
> 💷 The bigger the block, the bigger the saving — down to **£37/hr** on a 20-hour block
> 🎯 Test prep sessions (4 hrs) in Peterborough, Grantham & Kettering — £160
> 🎓 New students: your first Assessment lesson (90 min) drops to just **£45** — that's £10 LESS than today
>
> **The good news:**
> ✅ Anything you've already booked or pre-paid stays at the price you paid — no exceptions
> ✅ Book or buy a block **before 1 August** and you get today's prices
>
> Same instructors, same cars, same 83% first-time pass rate — 430+ local passes and counting. 🚗💨
>
> 📅 Book online: d4driving.co.uk
> 📞 07872 347686 (Robert) · 07590 719888 (Rakesh)

---

_Prepared 4 July 2026 · No website changes made yet_
