import type { HomepageHero } from '@libs/util/server/homepage.server';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

const EASE = [0.22, 1, 0.36, 1] as const;

const CTA_CLASSES: Record<HomepageHero['cta_variant'], string> = {
  // Hover is deliberately perceptible: the brown lifts + lightens + drops a shadow.
  primary:
    'bg-kira-brand text-white hover:bg-[#5C3720] hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.6)] focus-visible:bg-[#5C3720]',
  outline:
    'border border-white/90 text-white hover:border-white hover:bg-white hover:text-kira-brand hover:shadow-[0_16px_36px_-16px_rgba(0,0,0,0.45)] focus-visible:bg-white focus-visible:text-kira-brand',
  glass:
    'border border-white/25 bg-white/20 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/35 hover:shadow-[0_16px_36px_-16px_rgba(0,0,0,0.4)]',
};

/** Title / subtitle / CTA rise into place one after another when a slide lands. */
const contentVariants = (reduceMotion: boolean) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 26 },
  center: {
    opacity: 1,
    y: 0,
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.65, ease: EASE, staggerChildren: 0.08, delayChildren: 0.08 },
  },
});

const itemVariants = (reduceMotion: boolean) => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
  center: {
    opacity: 1,
    y: 0,
    transition: reduceMotion ? { duration: 0 } : { duration: 0.55, ease: EASE },
  },
});

/**
 * One slide of the hero carousel: photograph, heading, subtitle and CTA as plain
 * DOM (LCP-safe, no layout shift) with a slow Ken Burns zoom and staggered text
 * while the slide is active.
 */
export const HeroSlide = ({
  slide,
  index,
  total,
  isActive,
  priority,
}: {
  slide: HomepageHero;
  index: number;
  total: number;
  isActive: boolean;
  priority: boolean;
}) => {
  const reduceMotion = useReducedMotion() ?? false;
  const isCentered = slide.text_align === 'center';

  // Only the active slide is a real <h1>: the carousel must not advertise three
  // page headings (inactive slides are aria-hidden anyway).
  const Heading = isActive ? 'h1' : 'p';

  const ctaClassName = `pointer-events-auto inline-flex w-[280px] max-w-full items-center justify-center rounded-full border border-transparent px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.18em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out motion-safe:hover:-translate-y-[2px] motion-safe:active:translate-y-0 active:scale-[0.99] focus-visible:outline-none xl:w-[340px] ${CTA_CLASSES[slide.cta_variant]}`;

  const cta = slide.cta_href.startsWith('/') ? (
    <Link to={slide.cta_href} tabIndex={isActive ? 0 : -1} className={ctaClassName}>
      {slide.cta_label}
    </Link>
  ) : (
    <a href={slide.cta_href} tabIndex={isActive ? 0 : -1} className={ctaClassName}>
      {slide.cta_label}
    </a>
  );

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      aria-hidden={!isActive}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeInOut' }}
      style={{ zIndex: isActive ? 1 : 0 }}
      className={`absolute inset-0 ${isActive ? '' : 'pointer-events-none'}`}
    >
      <picture>
        {slide.image_mobile_url && <source media="(max-width: 767px)" srcSet={slide.image_mobile_url} />}
        <motion.img
          src={slide.image_desktop_url}
          alt=""
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          initial={false}
          animate={{ scale: isActive && !reduceMotion ? 1.06 : 1 }}
          transition={{ duration: isActive && !reduceMotion ? 11 : 1.2, ease: 'linear' }}
        />
      </picture>

      {/* Very light scrim so white type stays legible on bright photographs */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

      {/* Heading + subtitle */}
      <motion.div
        initial={false}
        animate={isActive ? 'center' : 'hidden'}
        variants={contentVariants(reduceMotion)}
        className={`absolute bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-[5] flex flex-col gap-3 px-6 sm:px-8 ${
          isCentered
            ? 'items-center text-center md:left-1/2 md:w-auto md:-translate-x-1/2 xl:bottom-32'
            : 'items-center text-center md:left-[5%] md:items-start md:text-left md:px-0 xl:bottom-32 xl:left-[80px]'
        }`}
        style={{ color: slide.text_color }}
      >
        <motion.div variants={itemVariants(reduceMotion)}>
          <Heading className="m-0 font-display font-extrabold leading-[0.95] tracking-[-0.01em] [font-size:clamp(2.75rem,8.3vw,7.5rem)]">
            {slide.title}
          </Heading>
        </motion.div>

        <motion.p
          variants={itemVariants(reduceMotion)}
          className="font-display font-light text-white/95 [font-size:clamp(1.05rem,2.1vw,1.875rem)] w-full text-end"
        >
          {slide.subtitle}
        </motion.p>

        <motion.div variants={itemVariants(reduceMotion)} className="mt-3 md:hidden">
          {cta}
        </motion.div>
      </motion.div>

      {/* Desktop CTA sits mid-left over the photograph */}
      <motion.div
        variants={itemVariants(reduceMotion)}
        initial={false}
        animate={isActive ? 'center' : 'hidden'}
        className="absolute left-[5%] top-[46%] z-20 hidden -translate-y-1/2 md:block xl:left-[90px]"
      >
        {cta}
      </motion.div>
    </motion.div>
  );
};
