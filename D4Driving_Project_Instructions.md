# D4Driving Website — Project Instructions

## Business
D4Driving School of Motoring is a DVSA Approved driving school run by Robert, a driving instructor since 2009, operating in Peterborough since 2017. The school offers manual lessons in a Toyota Aygo X and automatic lessons in a Toyota Yaris Cross, covering Peterborough, Grantham, and Kettering test centres.

## Brand Tokens
- **Red:** #BD2026 (primary accent, CTAs, highlights)
- **Red hover:** #d4252c
- **Slate:** #2C3E50 (headings, dark backgrounds, secondary buttons)
- **Sage:** #8FA3A0 (supporting text, subtle accents)
- **Background:** #FBFDFF
- **Background alt:** #F3F7FB
- **Font:** Plus Jakarta Sans (weights 300–800)
- **Design system:** Light glass-card aesthetic with backdrop blur, rounded corners (16px cards, 12px buttons), subtle shadows

## Tech Stack
- **Hosting:** GitHub Pages (existing repo, CNAME pointing to www.d4driving.co.uk)
- **Structure:** Static HTML/CSS/JS — single-file pages, no build step
- **Booking:** Cal.com embed (inline month view, calLink: "d4driving")
- **Blog/SEO:** Soro AI-generated articles via RSS feed, rendered on article.html
- **Payments:** Stripe payment links for lesson packages
- **WhatsApp:** Floating chat button linked to +447872347686
- **Phone:** AI Receptionist on +441733924271

## Site Pages
- **index.html** — Main homepage with hero, fleet cards, about section, coverage map, pricing grid, booking embed, reviews, blog feed, and contact form
- **starter-pack.html** — Standalone lead magnet download page for the free "Pass Your UK Driving Test First Time" PDF
- **article.html** — Individual blog article template (pulls from Soro RSS)
- **blog.html** — Blog listing page
- **D4Driving_Starter_Pack.pdf** — 8-page lead magnet PDF (branded, built with ReportLab + Plus Jakarta Sans)

## Content & Marketing Context
- **YouTube:** @d4drivingSOM (14K+ subscribers) — long-form driving lessons, test tips, route walkthroughs
- **TikTok & Instagram:** Recently launched, building from scratch — short-form daily content following a 30-day scripted plan
- **Lead funnel:** TikTok/Instagram bio → starter-pack.html → free PDF download (no email gate) → "Book a Lesson" CTA
- **Content batching system:** 2 hours/week — 30 min planning, 60 min filming (10–15 clips), 30 min editing in CapCut

## Key Rules When Editing
- Do NOT change existing page sections unless explicitly asked — the index page is long and carefully structured
- Match existing CSS patterns (glass-card, btn-red/btn-slate/btn-ghost/btn-outline classes, eyebrow headings, reveal animations)
- Keep all pages as single HTML files with inline CSS/JS — no external stylesheets or build tools
- Test centre names and coverage areas must remain accurate: Peterborough, Grantham, Kettering
- Stripe payment links and Cal.com embed config must not be modified without explicit instruction
