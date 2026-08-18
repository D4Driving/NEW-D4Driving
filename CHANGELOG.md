# D4Driving — Work Changelog

This file is auto-maintained by a daily routine as a backstop to the main plan doc (`D4Driving_Franchise_Integration_Plan.md`). It exists so no day's real work goes undocumented if it's ever missed during a working session — not a replacement for the plan doc.

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
