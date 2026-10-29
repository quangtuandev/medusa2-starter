# Homepage v2 (KIRA)

The homepage is a CMS-driven layout: a hero slider, a Best Seller block and the
`HalfFanSlider` deck for all collections.

## Backend — `homepage` module (`apps/medusa`)

| Piece | File |
|---|---|
| `hero_banner` model | `src/modules/homepage/models/hero-banner.ts` |
| `best_seller_section` model | `src/modules/homepage/models/best-seller-section.ts` |
| Service / module | `src/modules/homepage/{service,index}.ts` |
| Tables + seed | `src/modules/homepage/migrations/Migration20261028000001_CreateHomepage.ts` |
| Workflows (with compensation) | `src/workflows/upsert-homepage.ts` |
| Admin API | `src/api/admin/homepage/{hero,best-seller}/route.ts` (+ `validators.ts`) |
| Store API | `src/api/store/homepage/route.ts` |
| Admin UI | `src/admin/routes/homepage/page.tsx` (`/app/homepage`) |

Model highlights:

- `hero_banner`: **one row per carousel slide**, ordered by `rank`. Bilingual
  `title/subtitle/cta_label` (`_en`/`_vi`), desktop + mobile image, `cta_href`,
  `cta_variant` (`primary` · `outline` · `glass`), `text_color` and `text_align`.
- `best_seller_section`: bilingual `heading`/`description` and a JSON `items`
  array (`{ product_id?, image_url, link?, alt_en?, alt_vi?, rank }`, max 6).

Endpoints:

- `GET|PUT|POST /admin/homepage/hero` — `GET` returns every slide
  (`{ hero_banners, hero_banner }`), `PUT/POST` upserts one slide (a new slide is
  appended at the end unless `rank` is given), `DELETE /admin/homepage/hero/:id`
  removes a slide.
- `GET|PUT|POST /admin/homepage/best-seller` — singleton section (Zod-validated;
  `title`/`heading`/`cta_label` are accepted as language-neutral aliases).
- `GET /store/homepage?lang=en|vi` → `{ hero_slides, hero, best_seller, language }`
  where `hero_slides` are the active slides in `rank` order (each with the
  language-neutral `title`, `subtitle`, `cta_label`), plus `hero` = first slide for
  older clients. `Cache-Control: public, max-age=60, stale-while-revalidate=300`.

Activating it:

```bash
cd apps/medusa && yarn migrate   # creates hero_banner + best_seller_section and seeds the design defaults
```

The migration seeds the Rice Milk hero and three best-seller cards, so a fresh
database already renders the homepage.

## Admin UI

`/app/homepage` has two tabs:

1. **Hero Banner** — a slide manager: the list of slides (thumbnail, visibility,
   move up/down) with add/delete, and an editor per slide (image upload
   desktop/mobile, bilingual title/subtitle/CTA, CTA link, variant, text
   colour/alignment) with a live mini preview.
2. **Best Seller** — bilingual heading/description and 1–6 cards: product picker
   (auto-fills image, link and alt from the catalogue), per-card image upload, alt
   EN/VI, custom link, reorder/remove, plus a 3-column preview. The storefront
   renders them as a slider (3 per view on desktop, 2 on tablet, 1 on mobile).

## Storefront (`apps/storefront`)

| Piece | File |
|---|---|
| Data fetch (cachified + defaults) | `libs/util/server/homepage.server.ts` |
| Header overlay | `app/components/home/SiteHeader.tsx` |
| Hero slider + slide | `app/components/home/HeroSlider.tsx`, `HeroSlide.tsx` |
| Best Seller (card slider) | `app/components/home/BestSellerSection.tsx` |
| Collections deck | `app/components/home/CollectionsSection.tsx` |
| Floating chat + cart | `app/components/home/FloatingActions.tsx` |
| Route | `app/routes/_index.tsx` |

Notes:

- `fetchHomepageConfig` is cached for 10s (1h stale window) and **always** falls
  back to the design defaults when the store API is empty or unreachable, so the
  page never breaks on a fresh/edge backend. `?preview=1` bypasses the cache.
- `HeroSlider` is a crossfading carousel: 6.5s autoplay that keeps running while
  the pointer rests on the hero (only a hidden tab pauses it, and it keeps going
  with `prefers-reduced-motion` by switching slides instantly), arrows (mid-right,
  desktop only), swipe on touch and `←`/`→` keys. The hero intentionally has **no
  pagination dots** (client preference). Only the active slide renders an `<h1>`
  (the others are `aria-hidden` + `tabIndex={-1}`), so the page still has exactly
  one heading.
- `HeroScrollCue` (`app/components/home/HeroScrollCue.tsx`) is the centred
  "scroll down" arrow at the bottom of the hero (`bottom-11` / `md:bottom-[52px]`,
  horizontally centred): it fades in + drops 20px after an 0.8s delay, then
  breathes with a 10px / 1.6s loop (opacity 0.9 ↔ 0.6); hovering pauses the loop
  and scales it to 1.15 with a brighter stroke (0.2s ease-out); scrolling past
  50px fades it out with a further 15px drop (0.3s) and coming back to the top
  replays the entrance without delay. Clicking scrolls to `#best-seller` with a
  hand-rolled 0.8s ease-in-out tween (native smooth scroll has no easing hook).
- Motion (`motion/react`) drives the carousel: slides crossfade (`motion.div`
  opacity), the active photograph gets a slow 11s Ken Burns zoom (scale 1 → 1.06),
  and the title → subtitle → CTA rise in with a 0.08s stagger. The Best Seller
  cards fade/rise in when the section scrolls into view (staggered by index), lift
  6px on hover, and the pagination pill slides with a `motion.span` spring. Every
  one of these is disabled by `useReducedMotion` (opacity-only, no movement).
- The hero CTA has a real hover state (0.3s ease-out): `primary` lightens
  `#3B2314 → #5C3720`, lifts 2px and drops a soft shadow; `outline` fills white and
  flips the label to brand brown; `glass` brightens its translucent fill and border.
  `active:scale-[0.99]` gives tap feedback and `focus-visible` mirrors the hover
  colour for keyboard users (the transform is `motion-safe:` only).
- The first slide renders a real `<img fetchPriority="high" loading="eager">` plus
  its `<h1>`/subtitle in the DOM (LCP + zero CLS); the rest are lazy. The slides
  crossfade with opacity only, so the hero never changes height.
- No WebGL/lens effects: the hero is a plain crossfading image slider (the earlier
  liquid-glass experiment was dropped after client feedback).
- The deck reuses `HalfFanSlider` with `showInfoPanel={false}` and
  `heading={{ idle: "ALL\nCOLLECTIONS" }}`: the slider now renders its own heading,
  and while a card is focused it crossfades to **that card's title + subtitle**.
  The swap is a two-speed crossfade: the outgoing line fades out in 0.18s
  (`easeIn`, blur 0 → 8px) while the incoming one blooms in over 0.55s
  (`cubic-bezier(.22,1,.36,1)`, `y 14 → 0`, blur 10px → 0), so the two never read
  as a muddled double text. A hidden two-line reserve box keeps the deck perfectly
  still (measured: container `t=151 b=286` before, during and after the swap). Clicking outside the deck returns it to "ALL
  COLLECTIONS". `/products` and `/collections/<handle>` pass no `heading`, so their
  layout is unchanged. Card data comes from `/store/slider-cards`, falling back
  to collections that expose `metadata.cover_image` (or `metadata.image`), and
  finally to the component's built-in placeholder cards.
- The Best Seller block is a native scroll-snap slider: arrows next to the heading
  (desktop), dots and swipe (mobile), keyboard `←`/`→` when the track is focused,
  and the dots/arrows only appear when the cards do not fit in one page. The track
  is `overflow-x-auto` **+ `overflow-y-hidden`** (with `pt-2` headroom for the hover
  lift): without it the browser computes `overflow-y: auto`, making the track
  vertically scrollable by a few pixels and swallowing vertical swipes instead of
  scrolling the page. The card
  width is `calc((100% - gaps) / 3)` on desktop and `/(2)` on tablet, so the
  measured page count always matches what the user sees.
- `tailwind.config.js` gained the `kira` palette: `brand #3B2314`, `accent #FFE600`,
  `ink #111111`, `body #8A8A8A`, `surface #FFFFFF`, `onHero #FFFFFF`.
- `MenuToggle` and `LanguageSwitcher` gained a `variant="brand"` (white pill with
  the brown icon / brown pill with the white letter) used by the hero header.
- Page shell: `/` still hides the site header, footer and the default floating
  buttons (`Page.tsx`), because `SiteHeader` and `FloatingActions` provide the v2
  versions.

## Verification

- `npx tsc --noEmit` is clean for every new file in both apps.
- Homepage renders with the fallback data on the test backend (no `/store/homepage`
  there yet): hero, BEST SELLER (3 cards) and ALL COLLECTIONS (fan deck) all paint,
  desktop `1440×900` and mobile `390×844`, no horizontal overflow.
- Autoplay: with the pointer parked over the hero the slide advanced
  `0 → 1 → 2 → 0` on a ~6.5s beat; with `prefers-reduced-motion: reduce` it also
  advances (instant switch, no crossfade animation).
- Scroll cue: invisible until ~0.8s, then `opacity 0 → 1` with `translateY(-20px)
  → 0`; idle loop measured at `opacity 0.60 ↔ 0.90` / `translateY 0 → 10 → 0`;
  hover = `scale(1.15)` + loop paused; `scrollY > 50` = hidden (`translateY 15`);
  click = 900px scrolled in 0.8s landing with the section top at 0. Desktop gap
  52px, mobile 44px, centred (`cx = 720` at 1440 / `195` at 390).
- Motion: hero crossfade + staggered text + Ken Burns (image `scale(1.06)` when
  active, `translateY(7px) → 0` on the incoming text mid-transition); Best Seller
  cards `opacity 0.65 → 1` with `translateY(10px) → 0` on scroll-in and
  `translateY(-6px)` on hover.
- Touch axes on the Best Seller track: a vertical swipe scrolls the **page**
  (`scrollY 764 → 1008`) while the track's `scrollTop` stays 0, and a horizontal
  swipe slides only the track (`scrollLeft 0 → 328`) with the page still.
- Best Seller slider: 6 cards → 2 pages on desktop (arrows move a full page,
  prev/next disable at the ends, dots follow, `←` goes back) and 6 pages on
  mobile (1 card per view, 6 dots, no horizontal page overflow).
- Hero slider: 3 slides crossfade (aria-hidden updates), arrows navigate (no dots),
  swipe advances on touch, autoplay advances after ~6.5s and stays put with
  `prefers-reduced-motion: reduce`; the active `<h1>` follows the slide; no
  horizontal overflow at 390px; no WebGL canvas on any slide.
- Still to run with a live database: `yarn migrate`, `GET /store/homepage`, and the
  admin flow (`/app/homepage` → save → storefront updates).
