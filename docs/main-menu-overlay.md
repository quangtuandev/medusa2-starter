# Main menu overlay (desktop "artboard" menu)

`apps/storefront/app/components/common/menu/Main.tsx` — the full-screen menu opened
from the `MenuToggle` (homepage header + the injected toggle on `/stories`).

## Bug that was fixed (Oct 2026)

**Symptom**: the composition did not fit the web view — the five frames sat in the
upper third, the "THIS IS OUR" title and the bench/floor background were off
screen, and scrolling the page moved the menu (and its close button) away.

**Root cause**: the overlay root used `absolute inset-0`. `absolute` resolves
against the nearest positioned ancestor, and since the homepage rewrite the menu is
rendered inside the tall, scrolling route container (measured **2676px** at
1440×900). So the overlay was as tall as the *page*, not the *viewport*:

| viewport | overlay rect | title position | frames |
|---|---|---|---|
| 1440×900 | `0 → 2676` | `t=2302` (off screen) | OK |
| 1440×700 | `0 → 2536` | `t=2190` (off screen) | OK |
| 1920×1080 | `0 → 2856` | `l=-115 → r=2035` (overflow) | PRODUCT cut by 62px at the top |

`/stories` never showed the bug because that page is `h-[100dvh] overflow-hidden`.

## What the fix does

1. **Viewport-anchored, escaped from the page flow**
   - root is `fixed inset-0 h-[100dvh] w-screen overflow-hidden`;
   - the whole overlay is rendered through **`createPortal(…, document.body)`** so
     no transformed/overflow ancestor can change its coordinate space.
2. **Design canvas + two-axis fit** — replaced the `vh`-based frame positions and
   the width-only `menuZoom` with the **1840 × 900** artboard the design was drawn
   on (so at 1440×900 the result is pixel-identical to the current site):
   - frames at absolute canvas coordinates (`left/right/top`, `imageWidth` px) taken
     from the original `vh` values on a 900px basis — e.g. BLOG `left 160 / top 315`
     (35vh), PRODUCT `460 / 81` (9vh), STORY `860 / 189` (21vh), CONTACT
     `1130 / 360` (40vh), STORES `right 160 / top 153` (17vh);
   - `scale = min(MAX_SCALE, (vw − 2·24) / 1520, (vh − 2·12) / 900)`, `MAX_SCALE = 1.12`;
   - the "this is / our" line stays on the **overlay** (`bottom-[14vh]`, scaled by
     the same factor with `transform-origin: bottom center`), so it keeps sitting on
     the bench exactly like the current site instead of drifting with the artboard.
3. **Scroll lock** — `body`/`html` get `overflow: hidden` while open (with
   scrollbar-width padding compensation) and the previous values are restored on
   close.
   > ⚠️ **Keep the frame's local stacking context.** The hover effect is animejs
   > driven and relies on the DOM structure that was there before the fix:
   > the frame wrapper stays `z-[9999]`, the caption stays `z-[-1]`, the image
   > `z-[-2]`, and `FancyText` keeps `z-[9]` + the white desktop colour
   > (`desk:text-white`). Drop any of those and the big hover word renders *behind*
   > the frame, in black, instead of over it — which is exactly the regression that
   > happened once and is now restored.
4. **Dialog semantics** — `role="dialog"`, `aria-modal="true"`,
   `aria-label={t('menu.title', { defaultValue: 'Main menu' })}`, focus moves to the
   first item on open, **Tab/Shift+Tab are trapped**, **Escape** closes, and focus is
   returned to the opener. `MenuToggle` now forwards `aria-expanded` /
   `aria-controls="main-menu"` (passed from `SiteHeader.tsx` and `Page.tsx`).

## Verification (headless Chrome)

| Check | Result |
|---|---|
| Overlay rect @ 1440×900 / 1920×1080 / 1440×700 / 1366×768 / 1280×720 / 1024×768 | exactly `0 → viewport height` (position `fixed`) |
| Frame overflow (all 5 frames, all sizes) | `top/bottom/left/right = 0` |
| Title | `t=527 b=774 l=61 r=1379` at 1440×900 — identical to production; `offBottom = 0` at 1920×1080 / 1440×700 / 1366×768 / 1280×720 / 1024×768 |
| Layout parity | pixel diff against `kira.devjournal.io.vn` at 1440×900: **mean Δ 0.02/255, 0.02% of pixels > 24** (was 2.66 mean / 2.25% before the artboard was matched) |
| Wheel over the overlay | `scrollY` stays `0` (page locked), overlay/toggle do not move |
| Tab from the last item | wraps to the first item (focus stays inside) |
| Escape / close button | overlay closes, `aria-expanded=false`, focus back on "Open menu" |
| Hover a frame | caption fades/slides in at `opacity 1`, **white**, image `scale 1.15`, backdrop `1` → leaving resets `opacity 0`, `scale 1`, backdrop `0` (checked on PRODUCT and CONTACT) |
| `/stories` entry point | same correct geometry (frames overflow 0) |
| `tsc` | no errors in the touched files |

Note: `Page.tsx` also had a pre-existing type error (`zalo` passed to
`LiveChatIcon`, whose config only accepts `facebook`/`instagram`); it was removed
while touching the file.
