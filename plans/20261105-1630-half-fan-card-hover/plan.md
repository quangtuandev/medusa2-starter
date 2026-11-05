# HalfFanSlider Card Hover Plan

## Goal
Add a pre-click hover state to every fan card: on mouse/trackpad hover, only that card lifts above the fan; clicking then runs the existing focus/flip flow. Touch behavior remains unchanged.

## Current behavior
- [`HalfFanSlider.tsx`](../../apps/storefront/app/components/product/HalfFanSlider.tsx) uses `activeIndex` only for click focus.
- Outer card layer controls fan rotation and stacking; inner layer controls focus scale/lift/flip/dim.
- No card-level hover state exists. `DynamicCollection` only crossfades `image` → `image_active` on CSS hover.
- First click focuses; second click navigates. Keyboard Enter/Space follows the same flow.

## Selected design
Introduce `hoveredIndex` for fine-pointer devices. Hover is a lightweight preview state, separate from `activeIndex`:

`rest → hover lift → click focus/flip → second click navigate`

Only apply hover when cards are dealt, no card is focused, pointer supports hover, and reduced motion is off. This avoids transform conflicts with the click animation.

## Files
- **Modify:** [`HalfFanSlider.tsx`](../../apps/storefront/app/components/product/HalfFanSlider.tsx)
- **Update:** [`fan-hero-animation.md`](../../docs/fan-hero-animation.md)
- No new component or dependency.

## Implementation
1. Add tuning tokens near existing animation constants:
   - `HOVER_LIFT` (recommended `-28px` desktop; scale proportionally/mobile disabled)
   - `HOVER_SCALE` (recommended `1.04`)
   - `HOVER_DURATION` (`0.22–0.28s`)
   - `HOVER_SHADOW` for clear elevation.
2. Add `hoveredIndex: number | null` state.
3. Add pointer handlers to each outer card:
   - `onPointerEnter`: set index only when `pointerFine && dealt && !hasFocus`.
   - `onPointerLeave`: clear only when leaving the same card.
   - Clear hover when focus starts, when pointer capability changes, and when cards/data change.
4. Derive `isHovered = hoveredIndex === i && !hasFocus` for each card.
5. Keep the outer layer responsible only for fan rotation/z-order:
   - hovered card gets temporary `zIndex` above resting siblings but below focused card.
   - preserve its fan angle; do not straighten/flip on hover.
6. Extend the inner animation states:
   - focused: existing scale/lift/flip unchanged.
   - dimmed: existing behavior unchanged.
   - hovered: `y: HOVER_LIFT`, `scale: HOVER_SCALE`, opacity `1`, no `rotateY` increment.
   - resting: existing values.
   - Add hover-specific transition; do not restart flip or focus transitions.
7. Apply hover shadow to both card faces, while focused shadow remains highest priority.
8. Keep click sequence unchanged:
   - hover never writes `activeIndex` or `flipTurns`.
   - first click focuses and starts existing flip.
   - second click navigates.
9. Update comments/docs that currently state “hovering never moves the fan.”

## Interaction matrix
| Input/state | Expected behavior |
|---|---|
| Fine pointer, idle | Hovered card lifts/scales; siblings stay still |
| Pointer leaves | Card returns smoothly to exact fan position |
| Click while hovered | Hover state ends; existing focus/flip begins |
| Hover while one card focused | Ignored; focused/dimmed animation remains authoritative |
| Touch/coarse pointer | No hover; current tap/swipe behavior unchanged |
| Keyboard focus | Existing Enter/Space flow unchanged; optional `:focus-visible` may share hover emphasis if visual parity is required |
| Reduced motion | No lift/scale; use shadow/z-index only or no hover motion |

## Verification
1. Desktop mouse: hover every card, especially overlapped edges; only targeted card rises.
2. Rapidly sweep across cards; no stuck raised card or z-index flicker.
3. Hover then click: focus/flip begins from hover smoothly; no snap, rewind, or double transform.
4. Second click still navigates; outside click still resets focus.
5. Verify homepage, `/products`, and `/collections/:handle` usages.
6. Touch viewport: swipe/tap remains unchanged; no synthetic-hover lock.
7. `prefers-reduced-motion`: no lift/scale animation.
8. Verify 3-card and 6-card datasets, no clipping or horizontal overflow.
9. Run storefront typecheck and targeted browser interaction test.

## Acceptance criteria
- Hovering a card visibly raises only that card before any click.
- Hover does not trigger flip, dim siblings, change heading, or navigate.
- First and second click behavior remains exactly as today.
- No hover behavior on touch.
- No transform/z-index jump when entering hover; base and hover states retain stable transform layers.

## Risks
- **Transform conflict:** hover and focus both need `y/scale`. Mitigate with one ordered inner animation state, not nested ad-hoc transforms.
- **Overlap hit areas:** raised card z-index must remain stable; verify edge cards and rapid pointer movement.
- **Clipping:** stage height must accommodate `HOVER_LIFT`; tune lift rather than changing layout unless screenshots show clipping.
- **Image crossfade coupling:** `DynamicCollection` already changes artwork on hover; preserve it unless Figma requires lift-only behavior.

## Unresolved questions
- Exact Figma lift distance, scale, duration, and easing were not provided. Start with `-28px`, `1.04`, `0.24s`, then visually tune against Figma.
- Confirm whether keyboard `focus-visible` should receive the same raised preview as mouse hover.
