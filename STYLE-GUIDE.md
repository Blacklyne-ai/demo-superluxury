# Style Guide — Super Luxury Car Rental

Cinematic dark-luxury rebuild of superluxurycarrental.com (Dubai). The old Odoo site
is the **content source**, not the style template. Design language: black, warm ivory,
a single restrained champagne-gold accent.

## Logo colours (pixel-extracted)
The logo (`public/logo.png`, 377×254, white background) is a **winged gold emblem +
gold "CAR RENTAL" + charcoal serif "SUPER LUXURY"**.
- Dominant non-white pixels: **#998855** (antique gold core), saturated cluster **#8B804A**, saturated average **#998f61**.
- Primary brand colour = **muted champagne / antique gold** (warm, hue ~45°). Logo decides → gold is the accent.

### Logo assets
- `logo.png` — original, untouched 1:1 (white bg). Canonical reference; use on light contexts.
- `logo-mark.png` / `logo-knockout.png` — **dark-background version**: white knocked out to transparent, the charcoal "SUPER LUXURY" recoloured to ivory, gold left as-is. Standard reverse/knockout logo used across the (all-dark) UI — same artwork, only the dark wordmark inverted for legibility. (Judgement call, see JUDGEMENT_CALLS.md.)
- `favicon*.png`, `apple-touch-icon.png` — gold emblem on a dark coin with a faint gold ring.

## Colour palette (dark luxury) — single source: `src/styles/global.css :root`
| Token | Hex | Use |
|---|---|---|
| `ink` | #0A0A0B | deepest cinematic ground (page bg) |
| `coal` | #121214 | alternating section |
| `graphite` | #18181B | card surface |
| `steel` | #232327 | raised / borders |
| `ivory` | #F4F2EC | primary text on dark (warm, matches logo whites) |
| `mist` | #B4AFA4 | secondary text |
| `faint` | #7C786F | tertiary / labels |
| `gold` | #C6A45C | **accent** — prices, CTAs, hairline highlights (sparingly) |
| `gold.lite` | #E4CE97 | highlights / hover |
| `gold.deep` | #93824B | logo-true, borders |

Gold is used **sparingly** — prices, primary CTAs, eyebrow kickers, hairline accents. Never flooded.

## Typography
- **Display / headlines: Sora** (600/700) — architectural, modern, confident in caps; reads "automotive 2026". Self-hosted woff2.
- **UI / body / specs / prices: Inter** (variable) — neutral, legible, great tabular numerals for AED prices. Self-hosted variable woff2.
- `font-display: optional` on all faces → no headline reflow (CLS ≈ 0). Avoids Fontsource's `swap` default that causes layout shift.

## Voice
Souverän, knapp, exclusive, service-led. **English primary** (Dubai / international).
Trust signals (24/7, transparent pricing, free Dubai delivery) without empty hype.
No banned formulas ("Where luxury meets the road", "Premium Excellence", "X areas — one Y",
"4 reasons why…"). Real, verbatim copy from the source where it exists; gaps → Operator-TODO.

## Language
- **EN** primary (no prefix).
- **AR** (`/ar`) is an RTL placeholder (`dir="rtl"`, real Arabic copy) + Operator-TODO for the full Arabic translation/RTL pass (Phase 2). The old site exposed an Arabic switch.

## Hero video switch (`src/components/Hero.astro`)
The cinematic Dubai header film (Burj Khalifa descent → supercar drive through Downtown,
golden hour) is **delivered by Blacklyne later** and dropped at:
- `/public/film/hero-dubai.mp4` + poster `/public/film/poster.webp` (LCP).

Until then the hero shows a **high-end poster placeholder** (currently an AI-generated
cinematic Dubai still at `poster.webp` — see JUDGEMENT_CALLS; replace with the real film's
poster on delivery). Flip `HAS_VIDEO = true` in Hero.astro once the mp4 lands.

Playback:
- **(A) DEFAULT — calm autoplay loop**: `<video muted playsinline loop>`, played via JS only when motion is allowed. Best for a "busy" flight+drive film.
- **(B) SCROLL-SCRUB (PONY-style)**: prepared (commented) at the bottom of Hero.astro. Use **only if** the final film is calm/even enough; then ffmpeg `-g 1` keyframe-dense or frame-extraction + canvas-swap. Decision = Operator-TODO when the real film exists.
- `prefers-reduced-motion` → no autoplay/scrub, static poster. Sound always off. Poster is LCP, no layout shift.

## Motion
Smooth, restrained. `data-reveal` (IntersectionObserver, gated on `html.js` so content is
visible if JS is off). `prefers-reduced-motion` fully respected. Nav fades transparent→solid
on scroll. Hover: gentle image scale, gold border warm-up.

## Layout / components
- `Layout` (EN, dark, JSON-LD AutoRental), `Nav` (floating, transparent→solid, Fleet mega-dropdown, wishlist counter, mobile overlay), `Footer`, `Hero`, `FleetCard`.
- Fleet platform: `/fleet` (client filter: 7 categories + 18 brands + price + search + sort, URL-param shareable), `/fleet/[slug]` (gallery, specs, daily AED price, weekly/monthly "on request", book/WhatsApp/call, similar), `/fleet/wishlist` (localStorage).
- Cards/sets always symmetric. No 4+3 rows.

## Tech
Astro 5 static (`format:'file'`, `inlineStylesheets:'always'`, no SSR/adapter) · Tailwind v3.4 ·
@lucide/astro (no brand icons — Instagram/Facebook are inline SVG) · self-hosted fonts ·
Content Collection (`src/content/fleet`, 97 real cars) · sharp for image optimisation ·
Cloudflare Pages (build `npm run build`, output `dist`).
