import type { HomepageHero } from '@libs/util/server/homepage.server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HeroScrollCue } from './HeroScrollCue';
import { HeroSlide } from './HeroSlide';

/** How long each slide stays on screen before the carousel moves on. */
const AUTOPLAY_MS = 6500;

/**
 * Homepage hero carousel. Slides crossfade in place (no layout shift) and advance
 * on their own every `AUTOPLAY_MS`, even while the pointer is over the hero (a
 * mouse resting on the page must not stop it). Autoplay only pauses while the tag
 * is hidden; with `prefers-reduced-motion` it keeps going but switches slides
 * instantly. Arrows, swipe and arrow keys navigate (no pagination dots — client
 * preference).
 */
export const HeroSlider = ({ slides }: { slides: HomepageHero[] }) => {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [pageHidden, setPageHidden] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  // Autoplay: restarts whenever the slide changes, so manual navigation also
  // resets the countdown. It keeps running while the pointer is over the hero.
  useEffect(() => {
    if (total < 2 || pageHidden) return;

    const timer = window.setInterval(() => setIndex((current) => (current + 1) % total), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [total, pageHidden, index]);

  useEffect(() => {
    const onVisibilityChange = () => setPageHidden(document.hidden);
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  if (!total) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="KIRA hero"
      data-hero
      className="relative isolate h-[100svh] max-h-[1100px] min-h-[560px] w-full overflow-hidden bg-[#DCE6EE] md:h-[80vh] md:min-h-[600px] lg:h-screen lg:min-h-[760px]"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(index + 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(index - 1);
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX ?? null;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const delta = start - end;
        if (Math.abs(delta) < 45) return;
        go(delta > 0 ? index + 1 : index - 1);
      }}
    >
      {slides.map((slide, slideIndex) => (
        <HeroSlide
          key={`${slide.id ?? slide.title}-${slideIndex}`}
          slide={slide}
          index={slideIndex}
          total={total}
          isActive={slideIndex === index}
          priority={slideIndex === 0}
        />
      ))}

      <HeroScrollCue />

      {total > 1 && (
        /* Arrows: mid-right so they never collide with the CTA or the corners.
         No pagination dots on the hero (client preference). */
        <div className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex lg:right-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-black/10 text-white backdrop-blur-sm transition-colors hover:bg-black/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-black/10 text-white backdrop-blur-sm transition-colors hover:bg-black/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};
