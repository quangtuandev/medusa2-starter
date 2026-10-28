# HalfFanSlider — fan-deck hero (deal-in + click-to-focus)

Implementation of the "KIRA hero — fanned card deck" prototype in
`apps/storefront/app/components/product/HalfFanSlider.tsx`.

## Where it is used

- `/products` — full card deck + product grid below.
- `/collections/<handle>` — same deck, default text follows the current collection
  (`activeHandle`).

Cards come from `GET /store/slider-cards` (`slider_card` module), with a hardcoded
5-card fallback when the API returns nothing. `collectionHandles` (from the loaders)
decides which cards are "coming soon".

## Tuning constants (top of the component file)

| Constant | Value | Meaning |
|---|---|---|
| `CARD_RADIUS` | `18` | card corner radius (px) |
| `CARD_BORDER` | `4` | white border (px) |
| `CARD_SHADOW` | `0 20px 40px rgba(0,0,0,.18)` | resting shadow |
| `FOCUS_SHADOW` | `0 28px 60px rgba(0,0,0,.30)` | focus emphasis when motion is reduced |
| `FAN_SPREAD_DEG` | `48` | total spread for 5 gaps → `FAN_STEP_DEG = 9.6°` per card |
| `DESKTOP_GEO` | `200×340`, pivot `900`, stageH `470`, focusTop `40` | desktop geometry |
| `MOBILE_GEO` | `150×230`, pivot `800`, step `7°`, stageH `330`, focusTop `30` | mobile geometry |
| `FOCUS_SCALE` | `1.25` | focused card scale |
| `DIM_SCALE` / `DIM_Y` / `DIM_OPACITY` | `0.7` / `80` / `0.3` | rest of the fan while a card is focused |
| `DEAL_DURATION` / `DEAL_STAGGER` | `0.5s` / `40ms` | page-load deal |
| `FOCUS_A` | `0.18s` | phase A: z-index + straighten |
| `FOCUS_B` / `FOCUS_B_DELAY` | `0.6s` / `0.12s` | phase B: zoom-in + lift (slow glide) |
| `FLIP_DURATION` / `FLIP_DELAY` | `0.75s` / `0.12s` | the flip |
| `FOCUS_FLIP_DEG` | `180` | flip amount (0 = no flip). The card is double-sided, so a half turn still lands readable |
| `DIM_DURATION` / `RETURN_DURATION` | `0.5s` / `0.45s` | fan dims / returns to the fan |
| `TEXT_FADE` | `0.4s` | title / icon / subtitle crossfade |
| `COLOR_YELLOW` / `COLOR_BLUE` | `#F5D33F` / `#5B8DEF` | subtitle + icon colours |

The stage width is **derived** from the fan's real bounding box, so a 3-card deck
does not sit in a huge empty canvas and a 6-card deck still reaches ±24°.

## Animation spec as implemented

| State | Property (layer) | From → To | Timing |
|---|---|---|---|
| Page load | `rotate` (outer) | `angle(0)` → `angle(i)` | 0.5s, delay `i × 40ms`, ease-out |
| Rest | `rotate` (outer) | `angle(i)` | 0.3s ease-out |
| Focus phase A | `rotate` → 0, `zIndex` → 50 (outer) | — | 0.18s |
| Focus phase B | `scale` → 1.25, `y` → focus lift, `rotateY` → next multiple of `FOCUS_FLIP_DEG` (inner, `transformPerspective: 1200`) | — | zoom 0.6s / flip 0.75s, delay 0.12s, `easeInOutCubic` |
| Fan while focused | `rotate` ×0.7 (outer), `scale` 0.7 + `y` +80 + `opacity` 0.3 (inner) | — | 0.5s, delay 0.06s |
| Unfocus (click outside / another card) | same values in reverse (`rotateY` keeps its accumulated turns) | — | same durations |
| Text / icon / subtitle | opacity crossfade, two overlapping layers, fixed-height rows | — | 0.4s linear |

Implementation notes:

- Two nested transforms: the **outer** div only rotates around the fan pivot
  (`transform-origin: 50% 900px`), the **inner** div does the focus scale / lift /
  flip around its own centre. This is what keeps the arc and the focus animation
  from fighting each other.
- All cards sit at `left: 50%`, so the focused card lands on the horizontal centre
  automatically.
- `focusLift` is computed so the **scaled** card's top edge lands on
  `geo.focusTop` inside the stage (≈ y 196 absolute at 1440×900 under the header).
- Opening a card (second click) navigates with the router state flag
  `fanScrollToProducts`; the destination route calls `useScrollToProducts()`
  (`app/hooks/useScrollToProducts.ts`) and smooth-scrolls to the section with
  `id="collection-products"` — the product grid on both `/products` and
  `/collections/<handle>`. The scroll retries until the section exists and
  re-applies once after mount, because `<ScrollRestoration>` resets the page right
  after the route paints. Reduced motion switches it to an instant jump, and a
  direct visit (no flag) never scrolls.
- Focus is driven by **click**, not hover: hovering never moves the fan. A click on
  a card sets `activeIndex`; the same click on an already focused card follows its
  link. The focus is released by clicking outside the widget — the check treats the
  fan stage **and** the arrow row as "inside", so stepping with `‹ ›` does not reset
  it. Keyboard: `Enter` / `Space` behave exactly like a click (first focuses, second
  follows). Touch devices (`hover: none`) skip the focus step and navigate on tap.
- The flip runs **exactly one turn per hover**: the component keeps a per-card turn
  counter and the `rotateY` target is always `turns × FOCUS_FLIP_DEG` (180, 360,
  540…), so leaving never spins back and a slow flip is never cut short by a hard
  reset. The card is **double-sided** — two stacked faces with
  `backface-visibility: hidden`, the second pre-rotated 180° — so a half turn lands
  on the back face and still reads normally, without mirrored artwork.
- Backface-culling gotcha: the flip layer must **not** set `will-change`. It
  promotes the layer to its own compositor layer, Chrome then stops culling the
  hidden face, and the half turn lands mirrored again.
- Zoom (0.6s) and flip (0.75s) share `EASE_GLIDE` (easeInOutCubic) so the motion
  accelerates and settles softly instead of front-loading like an ease-out.
- `prefers-reduced-motion`: no deal, no flip, no scale/lift/dim — the focused card
  is signalled by `z-index` + `FOCUS_SHADOW`, and only the text crossfades.
- Touch (`hover: none`): hover-focus is disabled; arrows / swipe still browse and a
  tap keeps the previous behaviour (navigate to the collection, or select a
  not-yet-live card).

## Verification (headless Chrome, 1440×900)

- Click-driven flow: hovering a card leaves every `z-index` at `10..14`; one click
  sets the clicked card to `z-index: 50` and keeps the route; a second click follows
  the link; clicking empty space returns to `10..14`; `‹ ›` step `1 → 2 → 3`.
- 3 cards (real API data): rotations `-9.6 / 0 / +9.6`, z `10/11/12`; focused card
  `250×425` at `x 595..845`, top `196`, others opacity `0.3`; hero bottom `882`
  (fits 900); `scrollWidth === innerWidth`.
- 6 cards (design check): rotations `-24 / -14.4 / -4.8 / +4.8 / +14.4 / +24`,
  z `10→15`, stage `963×470`, no horizontal overflow.
- Flip: `scale·cos(rotateY)` series `1 → 1.11 → 0.75 → 0.14 → -1.18 → -0.47 → 0.88 → 1.25`
  (crosses zero = edge-on) then settles at 1.25.
- Reduced motion: rotations are final on the first frame, `m11` stays `1` during the
  focus (no flip) and the focused card does not move.

## Known deviations from the prototype spec

1. **Card overlap**: the spec's `±24°` with a 900px pivot yields ~25% overlap, not
   the 45% written in the spec (those two numbers are inconsistent for 6 cards).
   The angles were implemented as specified; to get a tighter deck change
   `FAN_SPREAD_DEG` (e.g. `35` → ~45% overlap) or `DESKTOP_GEO.pivotY`.
2. **"NEW" badge** on the second card is not implemented: `slider_card` has no badge
   field (`title/subtitle/image/image_active/icon/linkto/rank` only). Needs
   `badge_en` / `badge_vi` + a migration + the admin form field.
3. The page chrome from the prototype (wordmark, the two yellow round buttons, the
   `#FAFAFA` background) belongs to the prototype frame, not to this component —
   the hero runs inside the real site layout.
4. The card markup is doubled (two faces with the same artwork) so a 180° flip has
   something readable on the far side. That is the only cost: the artwork and badge
   are rendered twice per card.
