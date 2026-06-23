# Judgement Calls & Operator-TODOs — Super Luxury Car Rental

Decisions made during the rebuild and everything the operator must confirm before go-live.
Guiding rule: **nothing invented.** Real data where it exists; gaps flagged here, never faked.

## ★ Operator-TODOs (must resolve before launch)

1. **Hero film (Dubai).** Deliver the real cinematic film → `public/film/hero-dubai.mp4` + `public/film/poster.webp`, then flip `HAS_VIDEO = true` in `src/components/Hero.astro`. Decide playback: **(A) calm autoplay loop (default)** vs **(B) scroll-scrub** (only if the film is calm/even enough). See STYLE-GUIDE "Hero video switch".
2. **Hero poster is an AI placeholder.** `public/film/poster.webp` is currently an AI-generated cinematic Dubai still (generic black car, no branded vehicle), used only so the header isn't an empty black box. Replace with the real film's poster frame on delivery.
3. **Reviews — do NOT display numbers.** The old site claims "5.0 · 3,200+ reviews · #1 on Google". This is **unverifiable marketing**: independent Google-data scrapers show ~216–262 reviews (one source 4.0), never 3,200+. We therefore show **no review counts/stars anywhere** and built trust from the real verbatim "Why choose us" points instead. TODO: operator provides the live Google Business Profile link → wire a real reviews badge (rating renders only when `rating > 0`). Also drop the "#1 on Google" claim unless substantiated.
4. **Booking backend.** Default = enquiry flow: `/book` form composes a WhatsApp **or** email message (no backend); detail pages have Book / WhatsApp / Call. Decide whether to keep the Odoo cart/checkout as an option/link, or stay enquiry-only.
5. **Fleet data source.** `src/content/fleet` is a **snapshot** of the live Odoo catalogue (97 real cars, scraped 2026-06-23). For production decide: periodic snapshot refresh vs. live coupling to the Odoo `product.template` feed.
6. **Weekly / monthly prices.** The source publishes only a **daily** AED rate. Weekly/monthly are shown as **"On request"** (not invented). Provide real weekly/monthly tariffs if they should display.
7. **Deposit / insurance / fuel policy.** The `/terms` page has **no** security-deposit amount (deferred to the physical contract), no fuel policy, and no insurance excess. Add these if they should be public.
8. **Arabic (RTL).** `/ar` is a placeholder with real Arabic copy + `dir="rtl"`. Full Arabic translation and RTL pass = Phase 2.
9. **Operating entity & legal.** Footer says "by Dow Group"; `/terms` names "Super Luxury Car Rental L.L.C". `/legal` needs the UAE Trade Licence number, issuing authority (DED), VAT/TRN and confirmation of the Dow Group relationship.
10. **Brand logos.** Brand filtering uses brand **names** only (no third-party manufacturer logos). Add manufacturer logos only if licensed/permitted.

## Decisions made (rationale)

- **Logo on dark.** The original logo is gold emblem + gold "CAR RENTAL" + **charcoal** "SUPER LUXURY" on a **white** background — unreadable on a dark site. `logo.png` is kept 1:1 (original). For the all-dark UI we use a **knockout** (`logo-mark.png`): white background removed, the charcoal wordmark recoloured to ivory, gold untouched. This is the standard reverse logo, not a redesign. Favicons = the gold emblem on a dark coin.
- **Palette = black + champagne-gold + ivory**, gold pixel-extracted from the logo (#998855 family). Dubai-luxury direction, logo decides the gold hue.
- **Daily price is real** (scraped per car). Prominent on cards and detail; weekly/monthly "on request".
- **Free delivery nuance.** Cars show "Free pickup & drop-off anywhere in Dubai" (verbatim). The terms add that **delivery outside Dubai is a fee** — reflected on the detail/services copy, not hidden.
- **No contact form / no backend.** Per house style, contact = WhatsApp + Call + Email tiles; the booking form composes a WhatsApp/email message client-side.
- **Categories.** A car appears under **every** category it belongs to (the source lists e.g. a Ferrari Spyder under both Sports and Convertible). Filter uses full category membership; the card badge shows the primary (breadcrumb) category. Counts: Luxury 52 · SUV 36 · Sports 33 · Family 29 · Convertible 13 · Sedan 8 · Economy 2.
- **Dead products dropped.** 5 source products returned 404 (ids 37, 38, 44, 49, 59) and were excluded. 97 real cars remain.
- **Two cars share a source slug** ("Rolls Royce Ghost 2025", ids 98 & 99). The collection keys off the unique filename (`sourceSlug-id`), so both load.

## Real data captured (verbatim)
- Contact: Office F4 – 53, Al Khaimah 2 Building, Al Barsha, Dubai · +971 56 938 0038 · +971 55 933 9369 · info@superluxurycarrental.com.
- WhatsApp +971 55 933 9369 · Instagram @superluxuryrental · Facebook (profile id 61551483808888). No TikTok/YouTube/etc. on the source.
- No published opening hours → site states **24/7** (their own claim).
- About / vision / values / services / "why choose us" / full `/terms` — all verbatim (see `docs/scrape-content.md`).
- Blog: 6 real post titles/dates carried over; full article bodies = Operator-TODO (only the source openings are quoted).
