# Active Card Click-Outside Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear the product fan's `activeIndex` when the user presses outside the currently active card.

**Architecture:** Add a small DOM-boundary predicate that can be tested independently, then let `HalfFanSlider` manage one active-card ref and one conditional document `pointerdown` listener. Existing card click, hover, arrow, and swipe handlers remain intact.

**Tech Stack:** React 19, TypeScript, Jest 28 with ts-jest, DOM Pointer Events

## Global Constraints

- Do not create a Git commit.
- Preserve all existing staged edits in `apps/storefront/app/routes/products._index.tsx`.
- Do not stop event propagation or prevent default browser behavior.
- Mouse, touch, and pen input share the `pointerdown` path.

---

### Task 1: Active-card boundary behavior

**Files:**
- Create: `apps/storefront/app/routes/products/active-card-pointer.ts`
- Create: `apps/storefront/app/routes/products/active-card-pointer.test.ts`
- Modify: `apps/storefront/app/routes/products._index.tsx:1-3,162-190,300-335`

**Interfaces:**
- Produces: `isOutsideElement(element: HTMLElement | null, target: EventTarget | null): boolean`
- Consumes: the active card DOM node and `PointerEvent.target`

- [ ] **Step 1: Write the failing predicate tests**

```ts
import { isOutsideElement } from "./active-card-pointer";

describe("isOutsideElement", () => {
  it("returns false for the active card and its descendants", () => {
    const card = document.createElement("div");
    const child = document.createElement("span");
    card.appendChild(child);

    expect(isOutsideElement(card, card)).toBe(false);
    expect(isOutsideElement(card, child)).toBe(false);
  });

  it("returns true for an element outside the active card", () => {
    const card = document.createElement("div");
    const outside = document.createElement("button");

    expect(isOutsideElement(card, outside)).toBe(true);
  });

  it("returns false when no active card exists", () => {
    expect(isOutsideElement(null, document.body)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run from `apps/storefront`:

```bash
npx jest app/routes/products/active-card-pointer.test.ts --runInBand --config '{"testEnvironment":"jsdom","transform":{"^.+\\.tsx?$":"ts-jest"}}'
```

Expected: FAIL because `./active-card-pointer` does not exist.

- [ ] **Step 3: Implement the minimal predicate**

```ts
export function isOutsideElement(
  element: HTMLElement | null,
  target: EventTarget | null,
): boolean {
  return element !== null && target instanceof Node && !element.contains(target);
}
```

- [ ] **Step 4: Re-run the focused test and verify GREEN**

Run the same Jest command. Expected: all three tests PASS without warnings.

- [ ] **Step 5: Connect the tested behavior to `HalfFanSlider`**

Import `useEffect` and `useRef` from React and import `isOutsideElement`. Add `activeCardRef`, then conditionally attach the listener:

```ts
const activeCardRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (activeIndex === null) return;

  const handlePointerDown = (event: PointerEvent) => {
    if (isOutsideElement(activeCardRef.current, event.target)) {
      setActiveIndex(null);
    }
  };

  document.addEventListener("pointerdown", handlePointerDown);
  return () => document.removeEventListener("pointerdown", handlePointerDown);
}, [activeIndex]);
```

Assign the ref only to the active motion card:

```tsx
ref={isCardActive ? activeCardRef : undefined}
```

- [ ] **Step 6: Verify focused tests and storefront types**

Run:

```bash
npx jest app/routes/products/active-card-pointer.test.ts --runInBand --config '{"testEnvironment":"jsdom","transform":{"^.+\\.tsx?$":"ts-jest"}}'
npm run typecheck
```

Expected: focused tests PASS and TypeScript exits successfully. Do not commit.
