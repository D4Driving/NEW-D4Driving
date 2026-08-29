# D4Driving — Work Changelog

This file is auto-maintained by a daily routine as a backstop to the main plan doc (`D4Driving_Franchise_Integration_Plan.md`). It exists so no day's real work goes undocumented if it's ever missed during a working session — not a replacement for the plan doc.

## 2026-08-29
- Fixed the availability generator computing "9am-5pm" style hours in UTC instead of UK time, and widened Robert's weekday hours to 9am-8pm to match his actual working day (the old hours were narrower than he really works).
- The homepage availability list no longer relies on the flaky hourly GitHub Action at all: it now pulls live straight from Robert's (and Rakesh's) Cal.com diary through a new Cloudflare Worker proxy, which applies the same buffers and minimum notice Cal.com itself uses — so it can no longer show a slot that would actually get refused. The old GitHub Action feed remains only as a fallback if the Worker is ever unreachable. Confirmed the cron-timing gotcha from yesterday could not be fixed by moving it off the hour, so this replaces the fix rather than patching it further.
- Clicking a slot card now books directly on Cal.com, with "message on WhatsApp" kept as a secondary option rather than the only one.
- Added a 1 hour / 1.5 hour duration toggle to the booking slots, and a new 2-hour lesson option; the availability Worker now serves either instructor's diary, not just Robert's.
- Rakesh's page now shows a one-line availability signal instead of a full slot grid (his diary looks near-empty of clashes, which would have rendered as 30 near-identical rows). This loads immediately rather than waiting for scroll. Later the same day, softened the wording after confirming with Robert that Rakesh also takes bookings through the Total Drive app, which never reaches Cal.com — so the line no longer names a specific date or a count of open days, only that he "usually has space," and always points to WhatsApp to confirm.
- Raised the YouTube subscriber count from 25,000+ to 32,000+ across all 128 files that reference it (every article's author bio and newsletter box, plus index.html and mock-test.html).
- _Commits: f5e2d76, 0f9476a, bda6d93, 4d57daf, e707976, 225547a, 23752ae, 6806bc9, 3412df1, 75182ca, 63d3ffc, a11c913, f77b4e1, 7757782, 5137cd0, 27afebf, 9e43dba, b99320b, 7e26412, fc94220_
- _Plan doc status: already documented (D4Driving_Franchise_Integration_Plan.md §17–21 cover the timezone/hours fix, the Cal.com Worker move, direct Cal.com booking, the duration toggle and 2-hour lesson, Rakesh's availability panel, and the subscriber count)_
- _CLAUDE.md status: accurate (its Gotchas section already reflects the Cal.com Worker as the authoritative availability source, the corrected cron-timing note, the Rakesh/Total Drive caveat, and the 32,000+ subscriber count)_

## 2026-08-28
- Fixed the availability feed silently going stale: the hourly sync job had decayed from ~23 runs a day to about 1 a day over 25–28 Aug because its schedule sat exactly on the hour, GitHub's busiest and least reliable slot for scheduled jobs — the job itself was healthy throughout, it just wasn't being triggered. Real cost: a manual run that morning removed three lesson slots (4, 11, 15 Sep) that were already booked but had been shown as free under a live-looking badge for 11.5 hours. Schedule moved off the hour (to `:23`).
- The homepage availability list now visibly warns when the feed is more than 3 hours old (timestamp turns red, a banner says slots may already be taken) instead of always looking live, so a future missed sync is visible to visitors rather than silently wrong.
- Fixed a display bug where a second occurrence of the same weekday (e.g. a later Friday) could get filed under an earlier date's heading, hiding it — slots are now grouped by actual calendar date.
- Fixed the site's offline caching layer never actually catching the live availability data: a mismatch meant every homepage visit wrote a new, permanently-kept cache entry instead of reusing one, building up clutter in visitors' browsers over time. Cache version bumped to clear what had already piled up.
- Removed a leftover default "Hello, world!" GitHub Actions starter workflow that had been quietly running on every single commit, including the ~23 daily automated ones.
- _Commits: 5ce007a_
- _Plan doc status: ⚠ NOT yet in D4Driving_Franchise_Integration_Plan.md — none of today's availability-feed fixes (stale badge, date-grouping bug, cache bug, cron timing, blank.yml removal) are reflected there_
- _CLAUDE.md status: ⚠ stale by omission — the Gotchas section doesn't yet capture what was learned today: a GitHub Actions `schedule` cron set to the top of the hour (`0 * * * *`) is unreliable and can silently decay to a fraction of its intended runs, with no error anywhere. Worth a line alongside the existing "48-hour booking notice lives in two systems" gotcha, since it's the same file (`blog-sync.yml`) and the same failure mode (goes wrong silently)._

## 2026-08-20
- Cut the blog free from Soro (the cancelled article service): the site's articles are now generated in-house from a plain data file (`articles.json`) using a small new tool (`tools/gen-articles.js`), rather than pulled from Soro's feed. The hourly background job that used to fetch from Soro was rewired to just keep availability and the sitemap in sync.
- Small usability fix across all six main pages: clicking an on-page "jump to" link now stops just below the sticky top menu instead of hiding the target heading behind it.
- Big tidy-up of the behind-the-scenes documentation: added a short `CLAUDE.md` orientation file (read at the start of every working session) and moved all internal/business documents into one private repository, so nothing important is left without a backup. The main plan doc was updated to record all of this (new §16) and to correct a note about the site's domain setup.
- _Commits: 8061494, 90428f6, 3bd2029, 89d6cf6, b17dde4, e0830ee, 6350957_
- _Plan doc status: already documented (§16 records the consolidation, Soro decommissioning and Action rewiring; the plan-doc commits are part of today's batch)_
- _CLAUDE.md status: accurate (created/updated today; its "Article pages are static… since Soro was cancelled" gotcha already reflects today's work)_

## 2026-08-18
- Fixed a bug in the admin route editor where a form left open while typing could get silently overwritten with blanks (the page was rebuilding the open form from the database on background events like token refreshes, not just real sign-ins), which could wipe a route's description, notes and waypoint names on the next save. Saving a route now also properly saves waypoint names, and a save that's silently blocked by a permissions rule is now reported instead of looking like it worked.
- Fixed the admin video field so pasting a full YouTube share link (not just the bare video id) works correctly — previously this could store a mangled id and produce a dead video embed with no warning.
- Reworked the Published/Free tickboxes in the admin editor so it's clear what each one actually does: Published alone only lists a route on the site, it does not unlock the map/waypoints/video — Free does that. A live status line now explains what the current combination means, including flagging when a route is listed but effectively locked because paid packs aren't on sale yet.
- Brought admin.html's styling back in line with the site's documented design system (corner rounding, shadows, and text size that had drifted from the standard), and removed a second accent colour (green) that had crept into the admin page's "saved" feedback and status dots, replacing it with the documented sage/slate palette.
- Fixed a bug where publishing a route in admin wouldn't show up on the live site even after a refresh: the site's offline/caching layer was serving stale cached copies of the Supabase data instead of fetching fresh data, and could also risk showing paid route data to a signed-out visitor. Supabase requests now always go to the network, and old cached data was purged.
- _Commits: 578a540, 7591899, 28361b7, 8466810, 0821d4f, 451ba93_
- _Plan doc status: ⚠ NOT yet in D4Driving_Franchise_Integration_Plan.md — none of today's admin editor fixes or the service worker caching fix are reflected there_

## 2026-08-09
- The main plan doc was formally updated: the Polish landing page is now marked live and approved (it previously said "awaiting Robert's proofread"), and a new section records the 48-hour minimum booking notice and the nav simplification (red "Book Online" button removed, Polish flag language switch added) that had already gone live.
- Nav polish: dropdown menu corners tightened from 9px to 8px to match the site's documented design scale, and the mobile burger menu icon now switches color correctly (white over the dark hero, slate once the nav bar turns light on scroll) across all six pages that have it.
- _Commits: 372af52, ca19b00, 88a1445_
- _Plan doc status: ⚠ NOT yet in D4Driving_Franchise_Integration_Plan.md — the dropdown border-radius fix and the burger-icon color-state fix aren't reflected there; everything else in this batch is (the plan doc update itself)_

## 2026-08-08
- Polish-language landing page (`nauka-jazdy-peterborough.html`) got a round of fixes and polish: corrected a layout overflow in the pricing block grid on mid-size screens, applied Robert's copy corrections (new opening line "Mam na imię Robert", tighter headline, resized hero portrait), and rounded font sizes onto consistent steps.
- Removed the red "Book Online" button from the site navigation on every page (English and Polish) and tidied up the resulting nav bar spacing and Polish flag switcher position.
- Fixed a mobile navigation glitch where hovering over menu items caused visible jank (was resizing padding on hover, now animates smoothly instead).
- Added a housekeeping `.gitignore` file so internal strategy documents stay private and the `node_modules` folder stops getting committed by mistake.
- Polish flag language switch now displays correctly on mobile with a proper thumb-sized tap target, and the site now only advertises lesson availability slots that are at least 48 hours away, so last-minute slots that can't realistically be booked no longer show.
- _Commits: 30c58a2, e02871a, f9a7915, 4bdbd47, 77e8a2e, c0470f6, 654db0e, f5a74d1_
- _Plan doc status: ⚠ NOT yet in D4Driving_Franchise_Integration_Plan.md — the Polish Landing Page section still says "awaiting Robert's proofread"; the proofread/copy-correction commits, nav cleanup, and the mobile flag/48h-notice work aren't reflected there yet_

## 2026-08-04
- Added a short note to the main project plan explaining the new nightly Daily Doc Catch-up routine (what it does, that it's a backstop only, and that it never touches the plan doc or site files) — this was the only piece of real work logged today, and it's a documentation change about documentation, so nothing further was needed.
- _Commits: a4036c3_
- _Plan doc status: already documented_

## 2026-08-03
- Added cookieless Cloudflare Web Analytics tracking to all 132 site pages (so visits can be measured without needing a cookie consent banner), and updated the privacy policy to explain this. Also bumped the site's offline cache version so returning visitors get the latest files, and made sure a promotional page is excluded from the sitemap/robots file.
- Updated the main project plan with the latest status on pricing rollout, the installable app (PWA), analytics, and competitor monitoring, and refreshed the outstanding to-do list.
- Corrected Rakesh's (franchisee) Cal.com booking links and prices in the project plan, and flagged sections of the plan that are now out of date.
- _Commits: e13a6f7, ced31bf, f8fc0fe_
- _Plan doc status: already documented_
