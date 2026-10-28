import { motion, AnimatePresence, PanInfo, useReducedMotion } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Snowflake, Droplet, HelpCircle } from "lucide-react";
import { useI18n } from "@app/hooks/useI18n";
import { useIsMobile } from "@app/hooks/useIsMobile";
// Fallback collection items imports
import { AllCollection } from "@app/components/collection/items/all-collection";
import { ThirstyCollection } from "@app/components/collection/items/thirsty-collection";
import { SavouringCollection } from "@app/components/collection/items/savouring-collection";
import { IcyCollection } from "@app/components/collection/items/icy-collection";
import { ComingCollection } from "@app/components/collection/items/coming-collection";
import { DynamicCollection } from "@app/components/collection/items/dynamic-collection";
import { isOutsideElement } from "@app/routes/products/active-card-pointer";
import { FAN_SCROLL_STATE_KEY } from "@app/hooks/useScrollToProducts";

/* ────────────────────────────────────────────────────────────────────────────
 * "KIRA hero" fan-deck tokens.
 * Cards all sit at left:50% and are spread purely by rotating them around a
 * pivot far below (transform-origin 50% <pivot>px), which gives the hand-of-
 * cards arc. Tune the look from here.
 * ──────────────────────────────────────────────────────────────────────────── */
const CARD_RADIUS = 18;
const CARD_BORDER = 4;
const CARD_SHADOW = "0 20px 40px rgba(0,0,0,.18)";
/** Stronger shadow used to signal focus when motion is reduced. */
const FOCUS_SHADOW = "0 28px 60px rgba(0,0,0,.30)";

/** Outer cards sit at ±FAN_SPREAD_DEG/2; intermediate cards are evenly spaced. */
const FAN_SPREAD_DEG = 48;
/** Per-card rotation step; 9.6° x 5 gaps = the design's ±24° fan for 6 cards. */
const FAN_STEP_DEG = FAN_SPREAD_DEG / 5;
/** The fan "shrinks" towards the focused card instead of re-laying out. */
const DIM_SCALE = 0.7;
const DIM_Y = 80;
const DIM_OPACITY = 0.3;
/** A focused card is enlarged and lifted to FOCUS_TOP inside the stage. */
const FOCUS_SCALE = 1.25;

const COLOR_YELLOW = "#F5D33F";
const COLOR_BLUE = "#5B8DEF";

/**
 * How far the focused card flips around its vertical axis (0 = no flip).
 * The card is rendered double-sided (see the two faces below), so a half turn
 * lands on the card's back face and still reads normally — no mirrored artwork.
 */
const FOCUS_FLIP_DEG = 180;
const DEAL_DURATION = 0.5;
const DEAL_STAGGER = 0.1;
/** Focus phase A (z-index + straighten), then phase B (scale / lift / flip). */
const FOCUS_A = 0.18;
const FOCUS_B_DELAY = 0.12;
/** Zoom-in: slow and even, so the card glides forward instead of jumping. */
const FOCUS_B = 0.6;
/** The flip runs a little longer than the zoom so it reads clearly. */
const FLIP_DURATION = 0.75;
const FLIP_DELAY = 0.12;
/** Fan dimming while a card is focused. */
const DIM_DURATION = 0.5;
/** Back to the fan when the pointer leaves. */
const RETURN_DURATION = 0.45;
const TEXT_FADE = 0.4;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** easeInOutCubic — soft acceleration + deceleration for slow, smooth moves. */
const EASE_GLIDE = [0.65, 0, 0.35, 1] as const;

type StageGeometry = {
  cardW: number;
  cardH: number;
  pivotY: number;
  /** Rotation step between neighbouring cards, in degrees. */
  step: number;
  stageH: number;
  focusTop: number;
};

const DESKTOP_GEO: StageGeometry = {
  cardW: 200,
  cardH: 340,
  pivotY: 900,
  step: FAN_STEP_DEG,
  stageH: 470,
  focusTop: 40,
};

const MOBILE_GEO: StageGeometry = {
  cardW: 150,
  cardH: 230,
  pivotY: 800,
  step: 7,
  stageH: 330,
  focusTop: 30,
};

export interface SliderCardItem {
  id: string;
  handle: string;
  h1: string;
  title: string;
  subtitle?: string;
  image?: string;
  image_active?: string;
  icon?: string;
  linkto: string;
  component: (isActive: boolean, isAnyActive?: boolean) => React.ReactNode;
}

export interface HalfFanSliderProps {
  sliderCards?: any[];
  activeHandle?: string;
  /**
   * Handles of the collections that currently exist on the backend. Cards pointing
   * to any other collection are treated as "coming soon" and do not navigate.
   * Leave it undefined to skip the check (legacy behaviour).
   */
  collectionHandles?: string[];
  onDisplayCardChange?: (card: SliderCardItem) => void;
  className?: string;
}

/**
 * True on devices with a precise pointer (mouse / trackpad), false on touch.
 * Cards focus on click for these devices; on touch a tap navigates right away.
 */
function usePointerFine() {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCapable(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return capable;
}

const KEYWORD_ICONS = {
  snow: Snowflake,
  droplet: Droplet,
  soon: HelpCircle,
} as const;

const CardIcon = ({ icon, color }: { icon?: string; color: string }) => {
  const raw = (icon || "").trim();

  if (raw && (raw.startsWith("/") || /^https?:\/\//i.test(raw))) {
    return <img src={raw} alt="" className="w-10 h-10 object-contain" />;
  }

  const KeywordIcon = KEYWORD_ICONS[raw.toLowerCase() as keyof typeof KEYWORD_ICONS];
  if (KeywordIcon) {
    return <KeywordIcon size={40} strokeWidth={1.8} color={color} />;
  }

  return (
    <svg width="42" height="40" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.8813 4.1458C21.6774 -1.38207 29.4979 -1.38206 31.294 4.1458L33.2211 10.0769C34.0244 12.5491 36.3281 14.2228 38.9275 14.2228H45.1638C50.9762 14.2228 53.3928 21.6605 48.6905 25.0769L43.6452 28.7425C41.5423 30.2704 40.6623 32.9786 41.4656 35.4508L43.3927 41.3819C45.1888 46.9097 38.8619 51.5065 34.1597 48.0901L29.1144 44.4244C27.0114 42.8966 24.1639 42.8966 22.0609 44.4244L17.0156 48.0901C12.3133 51.5065 5.98646 46.9097 7.78257 41.3819L9.70971 35.4508C10.513 32.9786 9.63301 30.2704 7.53008 28.7425L2.48477 25.0769C-2.21751 21.6605 0.199145 14.2228 6.01149 14.2228H12.2478C14.8472 14.2228 17.1509 12.5491 17.9542 10.0769L19.8813 4.1458Z"
        fill={color}
      />
    </svg>
  );
};

export const HalfFanSlider: React.FC<HalfFanSliderProps> = ({
  sliderCards,
  activeHandle,
  collectionHandles,
  onDisplayCardChange,
  className,
}) => {
  const { t, currentLanguage } = useI18n();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const pointerFine = usePointerFine();

  const geo = isMobile ? MOBILE_GEO : DESKTOP_GEO;

  const initialCards = useMemo((): SliderCardItem[] => {
    if (sliderCards && sliderCards.length > 0) {
      return sliderCards.map((card: any): SliderCardItem => {
        const handle = card.linkto.split("/").pop() || "all";

        // Localize title and subtitle
        const title = currentLanguage === "vi" ? card.title_vi : card.title_en;
        const subtitle = currentLanguage === "vi" ? (card.subtitle_vi || "") : (card.subtitle_en || "");

        // Determine dynamic H1 prefix
        let h1 = currentLanguage === "vi" ? "ĐÂY LÀ BỘ SƯU TẬP" : "THIS IS OUR";
        if (handle === "all") {
          h1 = currentLanguage === "vi" ? "ĐÂY LÀ" : "THIS IS";
        } else if (handle === "coming") {
          h1 = currentLanguage === "vi" ? "PHÉP THUẬT MỚI" : "NEW MAGIC";
        }

        return {
          id: card.id,
          handle,
          h1,
          title,
          subtitle,
          image: card.image,
          image_active: card.image_active || undefined,
          icon: card.icon || undefined,
          linkto: card.linkto,
          component: (isActive: boolean, isAnyActive?: boolean) => (
            <DynamicCollection
              image={card.image}
              imageActive={card.image_active || undefined}
              title={title}
              isActive={isActive}
              isAnyActive={isAnyActive}
            />
          )
        };
      });
    }

    // Resilient Fallback to hardcoded collection slider cards
    return [
      {
        id: "all",
        handle: "all",
        h1: t('products.thisIs'),
        title: t('products.allOfOur'),
        subtitle: "",
        linkto: "/collections",
        component: (isActive: boolean) => <AllCollection isActive={isActive} />
      },
      {
        id: "thirsty",
        handle: "thirsty",
        h1: t('products.thisIsOur'),
        title: t('products.thirsty'),
        subtitle: t('products.thirstyDescription'),
        linkto: "/collections/thirsty",
        component: (isActive: boolean) => <ThirstyCollection isActive={isActive} />
      },
      {
        id: "savouring",
        handle: "savouring",
        h1: t('products.thisIsOur'),
        title: t('products.savouring'),
        subtitle: t('products.savouringDescription'),
        linkto: "/collections/savouring",
        component: (isActive: boolean) => <SavouringCollection isActive={isActive} />
      },
      {
        id: "icy",
        handle: "icy",
        h1: t('products.thisIsOur'),
        title: t('products.icy'),
        subtitle: t('products.icyDescription'),
        linkto: "/collections/icy",
        component: (isActive: boolean) => <IcyCollection isActive={isActive} />
      },
      {
        id: "coming",
        handle: "coming",
        h1: t('products.newMagic'),
        title: t('products.comingSoon'),
        subtitle: "",
        linkto: "/collections",
        component: (isActive: boolean) => <ComingCollection isActive={isActive} />
      },
    ];
  }, [sliderCards, currentLanguage, t]);

  const totalCards = initialCards.length;

  /* ── geometry ──────────────────────────────────────────────────────────── */
  /** Evenly spreads N cards: neighbouring cards sit `geo.step` degrees apart. */
  const angleOf = (index: number) => {
    if (totalCards <= 1) return 0;
    return Math.round((index - (totalCards - 1) / 2) * geo.step * 10) / 10;
  };

  // The stage is only as wide as the fan actually needs, so a 3-card deck does not
  // sit in a huge empty canvas (while a 6-card deck still gets the full ±24°).
  const maxAngle = Math.abs(angleOf(0));
  const maxAngleRad = (maxAngle * Math.PI) / 180;
  const fanRadius = geo.pivotY - geo.cardH / 2;
  const stageHalfWidth =
    (geo.cardW / 2) * Math.cos(maxAngleRad) +
    (geo.cardH / 2) * Math.sin(maxAngleRad) +
    fanRadius * Math.sin(maxAngleRad);
  const stageW = Math.ceil(stageHalfWidth * 2 + 48);


  /**
   * Vertical offset that puts the *scaled* focused card's top edge at geo.focusTop.
   * Scaling happens around the card centre, so the lift is fairly small.
   */
  const focusLift = geo.focusTop - (geo.stageH - geo.cardH / 2) + (geo.cardH * FOCUS_SCALE) / 2;

  /* ── state ─────────────────────────────────────────────────────────────── */
  // Clicking a card brings it to the front (zoom + flip); clicking the focused
  // card again follows its link. The arrows simply step this index.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dealt, setDealt] = useState(false);
  /** Completed half/full turns per card: each focus adds one, nothing ever rewinds. */
  const [flipTurns, setFlipTurns] = useState<Record<string, number>>({});
  const [stageScale, setStageScale] = useState(1);

  const stageRef = useRef<HTMLDivElement | null>(null);
  /** Info panel (title / arrows) — part of the widget, so clicks there keep focus. */
  const infoRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const focusIndex = activeIndex;
  const hasFocus = focusIndex !== null;

  /** Cards standing for "all collections" (keyword ALL, or a link to the index). */
  const isAllCard = (card: SliderCardItem) =>
    (card.handle || "").toLowerCase() === "all" ||
    /^all$/i.test((card.linkto || "").trim()) ||
    (card.linkto || "").trim().toLowerCase() === "/collections";

  // Rest state shows the collection you are on (collection pages) or the "all" card.
  const defaultCard = useMemo(
    () =>
      initialCards.find(
        (card) => !!activeHandle && card.handle?.toLowerCase() === activeHandle.toLowerCase()
      ) ??
      initialCards.find(isAllCard) ??
      initialCards[0],
    [initialCards, activeHandle]
  );

  const focusCard = focusIndex !== null ? initialCards[focusIndex] : null;
  const displayCard = focusCard ?? defaultCard;

  useEffect(() => {
    onDisplayCardChange?.(displayCard);
  }, [displayCard, onDisplayCardChange]);

  // Each time a card comes into focus it gets one more turn of rotation. Keeping
  // the accumulated angle means leaving never spins back (and a slow flip is never
  // cut short by a hard reset).
  useEffect(() => {
    const card = focusIndex !== null ? initialCards[focusIndex] : null;
    if (!card) return;
    setFlipTurns((prev) => ({ ...prev, [card.id]: (prev[card.id] ?? 0) + 1 }));
  }, [focusIndex, initialCards]);

  // Only accept clicks once the deal animation has settled.
  useEffect(() => {
    if (reduceMotion) {
      setDealt(true);
      return;
    }
    const timer = window.setTimeout(
      () => setDealt(true),
      (DEAL_DURATION + DEAL_STAGGER * Math.max(totalCards - 1, 0)) * 1000 + 120
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, totalCards]);

  // Scale the fixed-size stage down so it never overflows narrow viewports.
  useEffect(() => {
    const update = () => {
      const available = (document.documentElement.clientWidth || window.innerWidth) - 32;
      setStageScale(Math.min(1, Math.max(available, 240) / stageW));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [stageW]);

  // Clicking outside the stage releases a sticky selection.
  useEffect(() => {
    if (activeIndex === null) return;
    const handlePointerDown = (event: PointerEvent) => {
      // The fan and the arrow row both belong to the widget: clicking an arrow must
      // step the focus instead of clearing it first.
      if (
        isOutsideElement(stageRef.current, event.target) &&
        isOutsideElement(infoRef.current, event.target)
      ) {
        setActiveIndex(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeIndex]);

  /* ── collection targets ────────────────────────────────────────────────── */
  /**
   * A card's `linkto` is free text coming from the admin, so it can be a path
   * ("/collections/icy"), a full URL or a bare keyword ("ALL", "thirsty").
   * Returns where the card should lead, or flags it as coming soon when the
   * collection it advertises does not exist on the backend yet.
   */
  const resolveCardTarget = (
    card: SliderCardItem
  ): { href?: string; external?: boolean; comingSoon?: boolean } => {
    const linkto = (card.linkto || "").trim();
    const handle = (card.handle || "").toLowerCase();

    if (!linkto) return {};
    if (/^https?:\/\//i.test(linkto)) return { href: linkto, external: true };
    // "ALL" (or the built-in all card) means the complete collection list.
    if (handle === "all" || /^all$/i.test(linkto)) return { href: "/collections" };

    const isPath = linkto.startsWith("/");
    const target = /^\/collections\/([^/?#]+)/.exec(linkto)?.[1] ?? (isPath ? null : linkto);

    if (target) {
      // Without the collection list we cannot tell, so keep the previous behaviour.
      if (Array.isArray(collectionHandles) && !collectionHandles.includes(target)) {
        return { comingSoon: true };
      }
      return { href: isPath ? linkto : `/collections/${target}` };
    }

    return isPath ? { href: linkto } : {};
  };

  const isComingSoonCard = (card: SliderCardItem) =>
    card.handle === "coming" || !!resolveCardTarget(card).comingSoon;

  const handleCardClick = (index: number) => {
    const card = initialCards[index];
    if (!card || !dealt) return;

    // Mouse / trackpad: the first click focuses the card (zoom + flip), a second
    // click on the already focused card follows its link.
    if (pointerFine && activeIndex !== index) {
      setActiveIndex(index);
      return;
    }

    // Not live yet: keep it in front and let the info panel explain it.
    if (isComingSoonCard(card)) {
      setActiveIndex(index);
      return;
    }

    const { href, external } = resolveCardTarget(card);
    if (href) {
      if (external) {
        window.location.href = href;
      } else {
        // Ask the destination page to jump past the hero to the product grid.
        navigate(href, { state: { [FAN_SCROLL_STATE_KEY]: true } });
      }
      return;
    }

    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const next = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 1 % Math.max(totalCards, 1);
      return prev < totalCards - 1 ? prev + 1 : 0;
    });
  };

  const prev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return totalCards - 1;
      return prev > 0 ? prev - 1 : totalCards - 1;
    });
  };

  const handleSwipe = (event: any, info: PanInfo) => {
    if (!isMobile) return;
    const swipeThreshold = 50 / (stageScale || 1);
    const velocityThreshold = 500;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      next();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      prev();
    }
  };

  /* ── info panel text ───────────────────────────────────────────────────── */
  const subtitle = isComingSoonCard(displayCard)
    ? t('products.comingSoon')
    : displayCard.subtitle
      ? displayCard.subtitle
      : t('products.collection');
  const subtitleColor =
    isComingSoonCard(displayCard) || isAllCard(displayCard) ? COLOR_YELLOW : COLOR_BLUE;
  const iconColor = subtitleColor;

  const firstAngle = angleOf(0);

  return (
    <div className={clsx("flex flex-col items-center w-full", className)}>
      {/* Stage: fixed-size canvas, uniformly scaled to fit smaller viewports */}
      <div
        className="relative z-0 flex w-full justify-center mt-6 xl:mt-8"
        style={{ height: geo.stageH * stageScale }}
      >
        <div
          style={{
            width: stageW,
            height: geo.stageH,
            transform: `scale(${stageScale})`,
            transformOrigin: "top center",
          }}
        >
          <motion.div
            ref={stageRef}
            className="relative w-full h-full"
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
          >
            {initialCards.map((card, i) => {
              const angle = angleOf(i);
              const isFocused = focusIndex === i;
              const isDimmed = hasFocus && !isFocused;
              const cardIsComingSoon = isComingSoonCard(card);

              return (
                <motion.div
                  key={card.id}
                  ref={(element) => {
                    cardRefs.current[i] = element;
                  }}
                  onClick={() => handleCardClick(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCardClick(i);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t('products.collection')}: ${card.title}`}
                  className="absolute left-1/2 bottom-0 collection-card-item cursor-pointer outline-none"
                  style={{
                    width: geo.cardW,
                    height: geo.cardH,
                    marginLeft: -geo.cardW / 2,
                    transformOrigin: `50% ${geo.pivotY}px`,
                    zIndex: isFocused ? 50 : 10 + i,
                    willChange: "transform",
                  }}
                  initial={reduceMotion ? false : { rotate: firstAngle }}
                  animate={{
                    rotate: isFocused && !reduceMotion ? 0 : isDimmed ? angle * DIM_SCALE : angle,
                  }}
                  transition={
                    dealt
                      ? {
                        rotate: {
                          duration: isFocused
                            ? FOCUS_A
                            : isDimmed
                              ? DIM_DURATION
                              : RETURN_DURATION,
                          delay: isFocused ? 0 : 0.05,
                          ease: EASE_GLIDE,
                        },
                      }
                      : {
                        rotate: {
                          duration: DEAL_DURATION,
                          delay: reduceMotion ? 0 : i * DEAL_STAGGER,
                          ease: EASE_OUT,
                        },
                      }
                  }
                >
                  <motion.div
                    className="w-full h-full"
                    style={{
                      transformOrigin: "center",
                      transformPerspective: 1200,
                      // keep both card faces in 3D so backface-visibility works
                      transformStyle: "preserve-3d",
                      // NOTE: no `will-change` here — it promotes the flipper to its own
                      // compositor layer and Chrome then stops culling the hidden face,
                      // which makes a 180° flip land on the mirrored back face.
                      // (The parent card already hints `will-change: transform`.)
                    }}
                    animate={
                      reduceMotion
                        ? { scale: 1, y: 0, opacity: 1, rotateY: 0 }
                        : isFocused
                          ? {
                            scale: FOCUS_SCALE,
                            y: focusLift,
                            opacity: 1,
                            rotateY: (flipTurns[card.id] ?? 0) * FOCUS_FLIP_DEG,
                          }
                          : isDimmed
                            ? {
                              scale: DIM_SCALE,
                              y: DIM_Y,
                              opacity: DIM_OPACITY,
                              rotateY: (flipTurns[card.id] ?? 0) * FOCUS_FLIP_DEG,
                            }
                            : {
                              scale: 1,
                              y: 0,
                              opacity: 1,
                              rotateY: (flipTurns[card.id] ?? 0) * FOCUS_FLIP_DEG,
                            }
                    }
                    transition={
                      isFocused
                        ? {
                          scale: { duration: FOCUS_B, delay: FOCUS_B_DELAY, ease: EASE_GLIDE },
                          y: { duration: FOCUS_B, delay: FOCUS_B_DELAY, ease: EASE_GLIDE },
                          rotateY: {
                            duration: FLIP_DURATION,
                            delay: FLIP_DELAY,
                            ease: EASE_GLIDE,
                          },
                          opacity: { duration: FOCUS_A },
                        }
                        : isDimmed
                          ? {
                            scale: { duration: DIM_DURATION, delay: 0.06, ease: EASE_GLIDE },
                            y: { duration: DIM_DURATION, delay: 0.06, ease: EASE_GLIDE },
                            opacity: { duration: DIM_DURATION, delay: 0.06 },
                            rotateY: { duration: FLIP_DURATION, ease: EASE_GLIDE },
                          }
                          : {
                            scale: { duration: RETURN_DURATION, ease: EASE_GLIDE },
                            y: { duration: RETURN_DURATION, ease: EASE_GLIDE },
                            opacity: { duration: 0.3, ease: EASE_GLIDE },
                            rotateY: { duration: FLIP_DURATION, ease: EASE_GLIDE },
                          }
                    }
                  >
                    {/* Double-sided card: the second face is the same artwork rotated
                        180°, so a half turn lands readable instead of mirrored. */}
                    {[0, 1].map((face) => (
                      <div
                        key={`face-${face}`}
                        className="absolute inset-0 overflow-hidden bg-white"
                        style={{
                          borderRadius: CARD_RADIUS,
                          border: `${CARD_BORDER}px solid #fff`,
                          boxShadow: isFocused ? FOCUS_SHADOW : CARD_SHADOW,
                          backfaceVisibility: "hidden",
                          // Both faces need an explicit transform, otherwise Chrome
                          // does not cull the back face of the un-transformed one.
                          transform: `rotateY(${face === 1 ? 180 : 0}deg)`,
                        }}
                      >
                        {/* Placeholder behind the artwork: keeps the card readable even
                            when the admin image is missing or fails to load. */}
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              cardIsComingSoon || isAllCard(card)
                                ? `linear-gradient(160deg, ${COLOR_YELLOW}55, #ffffff 70%)`
                                : `linear-gradient(160deg, ${COLOR_BLUE}55, #ffffff 70%)`,
                          }}
                        />
                        <div className="relative w-full h-full">{card.component(isFocused, hasFocus)}</div>

                        {cardIsComingSoon && (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
                            <span className="rounded-full bg-black/70 px-3 py-1 font-title text-[10px] xl:text-xs font-bold uppercase tracking-wider text-white">
                              {t('products.coming')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Info block: fixed-height rows so the crossfade never shifts the layout */}
      <div
        ref={infoRef}
        className="relative z-20 flex flex-col items-center justify-center w-full px-6 mt-2 xl:mt-4"
      >
        <div className="relative flex h-12 xl:h-14 w-full items-center justify-center mb-2 xl:mb-3">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`icon-${displayCard.id}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TEXT_FADE, ease: "linear" }}
            >
              <CardIcon icon={displayCard.icon} color={iconColor} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative w-full h-[46px] xl:h-[96px]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`title-${displayCard.id}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TEXT_FADE, ease: "linear" }}
            >
              <h2
                className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-centuryBook italic text-[40px] leading-none xl:text-[90px]"
                dangerouslySetInnerHTML={{ __html: displayCard.title }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows flank the subtitle */}
        <div className="flex items-center gap-4 xl:gap-6 mt-2">
          <button
            onClick={prev}
            aria-label="Previous collection"
            className="p-2 xl:p-3 bg-[#FFE977] rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronLeft size={isMobile ? 18 : 24} />
          </button>

          <div className="relative h-[34px] xl:h-[68px] w-[220px] xl:w-[520px]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={`subtitle-${displayCard.id}`}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: TEXT_FADE, ease: "linear" }}
              >
                <p
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-title font-bold text-[26px] leading-tight xl:text-[64px]"
                  style={{ color: subtitleColor }}
                >
                  {subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={next}
            aria-label="Next collection"
            className="p-2 xl:p-3 bg-[#FFE977] rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronRight size={isMobile ? 18 : 24} />
          </button>
        </div>
      </div>
    </div>
  );
};
