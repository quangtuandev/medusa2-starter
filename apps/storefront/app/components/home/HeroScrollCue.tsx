import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/** Target scroll duration asked for by design (native smooth scroll has no easing hook). */
const SCROLL_DURATION_MS = 800;
/** How long after mount the entrance still counts as the first appearance. */
const FIRST_RUN_MS = 1400;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const scrollToTarget = (target: HTMLElement) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.scrollIntoView();
    return;
  }

  const startY = window.scrollY;
  const distance = target.getBoundingClientRect().top;
  const startedAt = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / SCROLL_DURATION_MS);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

/**
 * Centred "scroll down" arrow at the bottom of the hero.
 *
 * Outer layer: fades in and drops 20px after an 0.8s delay, scales to 1.15 on
 * hover, and fades out + drops 15px once the page scrolls past 50px (replaying
 * the entrance without delay when the page returns to the top).
 * Inner layer: the idle "breathing" loop — a 10px dip with opacity 0.9 ↔ 0.6 over
 * 1.6s — paused while hovering.
 */
export const HeroScrollCue = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const firstRunRef = useRef(true);

  // The 0.8s entrance delay only applies to the very first appearance.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      firstRunRef.current = false;
    }, FIRST_RUN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 50);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pauseLoop = hovered || hidden || reduceMotion;

  return (
    <div className="pointer-events-none absolute bottom-11 left-1/2 z-30 -translate-x-1/2 md:bottom-[52px]">
      <motion.button
        type="button"
        aria-label="Scroll to best sellers"
        // Start hidden so the cue can fade + drop in after the hero text lands.
        initial={{ opacity: 0, y: reduceMotion ? 0 : -20 }}
        animate={{
          opacity: hidden ? 0 : 1,
          y: hidden ? (reduceMotion ? 0 : 15) : 0,
          scale: hovered && !reduceMotion ? 1.15 : 1,
        }}
        transition={{
          duration: hidden ? 0.3 : hovered ? 0.2 : 0.5,
          ease: 'easeOut',
          delay: !hidden && firstRunRef.current ? 0.8 : 0,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => {
          const target = document.getElementById('best-seller');
          if (target) scrollToTarget(target);
        }}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none"
      >
        {/* Idle loop: slow 10px dip with a gentle opacity "breath". */}
        <motion.span
          initial={false}
          animate={pauseLoop ? { y: 0, opacity: 1 } : { y: [0, 10, 0], opacity: [0.9, 0.6, 0.9] }}
          transition={
            pauseLoop
              ? { duration: 0.2, ease: 'easeOut' }
              : { duration: 1.6, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY, repeatType: 'loop' }
          }
          className="flex items-center justify-center"
        >
          <svg
            width="34"
            height="36"
            viewBox="0 0 45 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M22.5 2V46M2 25.2222L22.5 46L43 25.2222"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.button>
    </div>
  );
};
