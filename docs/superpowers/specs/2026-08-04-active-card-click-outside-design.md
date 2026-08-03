# Active Card Click-Outside Design

## Goal

When a product collection card is active, clicking or tapping anywhere outside that active card clears `activeIndex` and restores the slider's default state.

## Scope

The change applies only to the product collection fan in `apps/storefront/app/routes/products._index.tsx`. Existing card selection, deselection, hover, navigation-arrow, and swipe behavior remains unchanged unless an outside interaction clears the current selection.

## Design

- Keep a ref to the currently active card element.
- Register a document-level `pointerdown` listener only while `activeIndex` is non-null.
- If the pointer target is outside the active card, call `setActiveIndex(null)`.
- If the pointer target is the active card or one of its descendants, allow the existing card click handler to toggle it normally.
- Remove the listener whenever the active selection changes or the component unmounts.

Using `pointerdown` covers mouse, touch, and pen input with one event path. The listener must not block propagation or alter the slider's existing interactions.

## Interaction Details

- Clicking the active card: the existing toggle behavior clears it.
- Clicking another card: the outside listener may first clear the old selection, then the clicked card's existing handler selects the new card.
- Clicking navigation controls or elsewhere on the page: the active selection is cleared.
- Swiping from outside the active card on mobile: the pointer-down clears the selection; existing swipe handling continues.

## Verification

- Select a card, click outside it, and confirm the slider returns to its default state.
- Select a card, click inside it, and confirm existing toggle behavior still works.
- Select one card, click another, and confirm the second card becomes active.
- Confirm outside clearing works with both mouse and touch/pointer input.
- Run the storefront's relevant static checks and tests.
