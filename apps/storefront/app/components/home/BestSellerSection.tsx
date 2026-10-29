import type { HomepageBestSeller, HomepageBestSellerItem } from '@libs/util/server/homepage.server';
import { motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cards rise in as the section scrolls into view (staggered by index). */
const cardVariants = (reduceMotion: boolean) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE },
  },
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Card = ({ item, reduceMotion }: { item: HomepageBestSellerItem; reduceMotion: boolean }) => (
  <motion.div
    whileHover={reduceMotion ? undefined : { y: -6 }}
    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    className="h-full"
  >
    <Link
      to={item.link || '/products'}
      viewTransition
      className="group block aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[#F3F1EE]"
    >
      <img
        src={item.image_url}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </Link>
  </motion.div>
);

/**
 * Homepage v2 "Best Seller" block: heading, description and a card slider.
 * The track uses native scroll-snap (drag/scroll on touch, arrows/dots/keyboard
 * otherwise), so it works with any number of cards — 1 to 6 from the CMS.
 */
export const BestSellerSection = ({ bestSeller }: { bestSeller: HomepageBestSeller }) => {
  const items = bestSeller.items ?? [];
  const reduceMotion = useReducedMotion() ?? false;

  const trackRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  /** Cards per view depends on the breakpoint, so measure instead of guessing. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-card]');
    if (!track || !card) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const step = card.offsetWidth + gap;
    if (step <= 0) return;

    const perView = Math.max(1, Math.round((track.clientWidth + gap) / step));
    setPageCount(Math.max(1, Math.ceil(items.length / perView)));
  }, [items.length]);

  useEffect(() => {
    measure();

    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  // Keep the dots in sync with dragging / wheel scrolling.
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth <= 0) return;

    const next = Math.round(track.scrollLeft / track.clientWidth);
    setActivePage(Math.min(pageCount - 1, Math.max(0, next)));
  };

  const goTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.min(pageCount - 1, Math.max(0, next));
    track.scrollTo({
      left: clamped * track.clientWidth,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    setActivePage(clamped);
  };

  if (!items.length) return null;

  const hasSlider = pageCount > 1;

  return (
    <section id="best-seller" className="w-full scroll-mt-20 bg-white py-16 md:pt-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8">
        <div className="relative flex flex-col items-center">
          <h2 className="text-center font-display font-semibold uppercase leading-[1.05] text-kira-brand [font-size:clamp(2.25rem,4.5vw,4rem)]">
            {bestSeller.heading}
          </h2>

          {hasSlider && (
            <div className="mt-5 hidden items-center gap-2 md:absolute md:right-0 md:top-1/2 md:mt-0 md:flex md:-translate-y-1/2">
              <motion.button
                type="button"
                onClick={() => goTo(activePage - 1)}
                disabled={activePage === 0}
                aria-label="Previous best sellers"
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-kira-brand/25 text-kira-brand transition-colors hover:bg-kira-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-kira-brand"
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
              </motion.button>
              <motion.button
                type="button"
                onClick={() => goTo(activePage + 1)}
                disabled={activePage >= pageCount - 1}
                aria-label="Next best sellers"
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-kira-brand/25 text-kira-brand transition-colors hover:bg-kira-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-kira-brand"
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
              </motion.button>
            </div>
          )}
        </div>

        {bestSeller.description && (
          <p className="font-alexandria font-extralight mx-auto mt-4 max-w-[1000px] text-center text-sm leading-relaxed text-kira-body md:mt-6 md:text-base">
            {bestSeller.description}
          </p>
        )}

        {/* Slider track: snap pages, draggable on touch, arrow keys on desktop */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={(event) => {
            if (!hasSlider) return;
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              goTo(activePage + 1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              goTo(activePage - 1);
            }
          }}
          tabIndex={hasSlider ? 0 : -1}
          role="group"
          aria-roledescription={hasSlider ? 'carousel' : undefined}
          aria-label="Best sellers"
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pt-2 pb-2 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6 lg:gap-8 xl:mt-16"
        >
          {items.map((item, index) => (
            <motion.div
              key={`${item.rank}-${item.image_url}`}
              data-card
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={cardVariants(reduceMotion)}
              transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
              className="w-[80vw] max-w-[340px] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none lg:w-[calc((100%-4rem)/3)]"
            >
              <Card item={item} reduceMotion={reduceMotion} />
            </motion.div>
          ))}
        </div>

        {hasSlider && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, page) => (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => goTo(page)}
                aria-label={`Go to best sellers page ${page + 1}`}
                aria-current={page === activePage}
                className="relative flex h-2 items-center px-0.5"
              >
                <motion.span
                  layout={!reduceMotion}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
                  className={`block h-2 rounded-full ${page === activePage ? 'w-7 bg-kira-brand' : 'w-2 bg-kira-brand/30'
                    }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
