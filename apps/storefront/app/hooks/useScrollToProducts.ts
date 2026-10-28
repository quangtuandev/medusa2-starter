import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Router-state flag the fan deck sets on the second click, so the destination
 * route can jump past the hero straight to the product grid.
 */
export const FAN_SCROLL_STATE_KEY = 'fanScrollToProducts';

/** Id the product sections expose as the scroll target. */
export const PRODUCTS_SCROLL_TARGET_ID = 'collection-products';

/**
 * Scrolls to the product grid as soon as it exists, then re-applies once more:
 * React Router's `<ScrollRestoration>` can reset the page right after the route
 * paints, and a single `scrollIntoView` would lose that race.
 *
 * Deliberately module-level (not tied to a component's lifecycle): navigating
 * remounts the route, and a cleanup would cancel the pending scroll.
 */
export function scrollToProducts() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const apply = () => {
    const target = document.getElementById(PRODUCTS_SCROLL_TARGET_ID);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  let attempts = 0;
  const tick = () => {
    if (document.getElementById(PRODUCTS_SCROLL_TARGET_ID)) {
      apply();
      window.setTimeout(apply, 240);
      return;
    }
    if (attempts++ < 20) window.setTimeout(tick, 40);
  };

  window.setTimeout(tick, 90);
}

/**
 * Honours the fan deck's "open this collection" click: when the navigation was
 * flagged, jump to the product grid. Runs once per navigation, so re-renders or
 * a browser refresh do not yank the page around.
 */
export function useScrollToProducts() {
  const location = useLocation();
  const stateRef = useRef(location.state);
  stateRef.current = location.state;
  const handledKey = useRef<string | null>(null);

  // Keyed on `location.key` only: `location.state` gets a new object identity on
  // re-render, and depending on it would re-run the scroll on every render.
  useEffect(() => {
    const state = stateRef.current as Record<string, unknown> | null;
    if (!state?.[FAN_SCROLL_STATE_KEY]) return;
    if (handledKey.current === location.key) return;
    handledKey.current = location.key;
    scrollToProducts();
  }, [location.key]);
}
