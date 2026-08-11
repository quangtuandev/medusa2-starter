import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoaderFunctionArgs, useLoaderData, NavLink } from "react-router";
import { useI18n } from "@app/hooks/useI18n";
import { useIsMobile } from "@app/hooks/useIsMobile";
import { fetchCollections } from "@libs/util/server/data/collections.server";
import { fetchProducts } from "@libs/util/server/products.server";
import { Container } from "@app/components/common/container";
import { ProductGrid } from "@app/components/product/ProductGrid";
// Fallback collection items imports
import { AllCollection } from "@app/components/collection/items/all-collection";
import { ThirstyCollection } from "@app/components/collection/items/thirsty-collection";
import { SavouringCollection } from "@app/components/collection/items/savouring-collection";
import { IcyCollection } from "@app/components/collection/items/icy-collection";
import { ComingCollection } from "@app/components/collection/items/coming-collection";
import { isOutsideElement } from "./products/active-card-pointer";

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
  component: (isActive: boolean) => React.ReactNode;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { collections } = await fetchCollections(request);

  // Map products into their respective collections
  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      const { products } = await fetchProducts(request, {
        collection_id: collection.id,
        limit: 100,
      });
      return { ...collection, products };
    })
  );

  const baseUrl = process.env.INTERNAL_MEDUSA_API_URL || process.env.PUBLIC_MEDUSA_API_URL || "http://localhost:7901";
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || "";

  let slider_cards = [];
  try {
    const res = await fetch(`${baseUrl}/store/slider-cards`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    });
    if (res.ok) {
      const data = await res.json();
      slider_cards = data.slider_cards || [];
    } else {
      console.error("Failed to fetch slider cards, status:", res.status);
    }
  } catch (error) {
    console.error("Error fetching slider cards from backend:", error);
  }

  return { collectionsWithProducts, slider_cards };
};

export default function HalfFanSlider() {
  const { t, currentLanguage } = useI18n();
  const { collectionsWithProducts, slider_cards } = useLoaderData<typeof loader>();
  const isMobile = useIsMobile();

  const initialCards = useMemo((): SliderCardItem[] => {
    if (slider_cards && slider_cards.length > 0) {
      return slider_cards.map((card: any): SliderCardItem => {
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
          component: () => (
            <img
              src={card.image}
              className="scale-110 object-cover w-full h-full select-none pointer-events-none"
              alt={title}
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
  }, [slider_cards, currentLanguage, t]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  // The "effective" active index - either clicked or hovered
  const effectiveIndex = activeIndex ?? hoveredIndex;
  const effectiveCard = effectiveIndex !== null ? initialCards[effectiveIndex] : null;

  // Default display card (when nothing is hovered/selected) - show the "All" card info
  const displayCard = effectiveCard ?? initialCards[0];

  const totalCards = initialCards.length;

  const next = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 1;
      return prev < totalCards - 1 ? prev + 1 : 0;
    });
    setHoveredIndex(null);
  };

  const prev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return totalCards - 1;
      return prev > 0 ? prev - 1 : totalCards - 1;
    });
    setHoveredIndex(null);
  };

  const handleClick = useCallback((index: number) => {
    setActiveIndex((prev) => prev === index ? null : index);
    setHoveredIndex(null);
  }, []);

  const handleSwipe = (event: any, info: PanInfo) => {
    if (!isMobile) return;
    const swipeThreshold = 50;
    const velocityThreshold = 500;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      next();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      prev();
    }
  };

  // Get virtual fanning index centering around active card
  const getVirtualIndex = useCallback((index: number) => {
    if (effectiveIndex === null) {
      return index - (totalCards - 1) / 2;
    }
    if (index === effectiveIndex) {
      return 0;
    }
    const remaining: number[] = [];
    for (let i = 0; i < totalCards; i++) {
      if (i !== effectiveIndex) {
        remaining.push(i);
      }
    }
    const pos = remaining.indexOf(index);
    const M = remaining.length;
    return pos - (M - 1) / 2;
  }, [effectiveIndex, totalCards]);

  // Calculate fan card positions
  const getCardTransform = (index: number) => {
    const isActive = index === effectiveIndex;
    const virtualIndex = getVirtualIndex(index);

    // Fan rotation: cards fan out from center
    const fanAngle = isMobile ? 12 : 15;
    const baseRotate = virtualIndex * fanAngle;

    // Horizontal spread
    const spreadX = isMobile ? 65 : 100;
    const baseX = virtualIndex * spreadX;

    // Vertical arc: cards at edges are lower, center cards higher
    const arcFactor = isMobile ? 14 : 10;
    const baseY = Math.abs(virtualIndex) * Math.abs(virtualIndex) * arcFactor;

    if (isActive) {
      return {
        x: 0, // Put active card exactly at the center!
        y: -(isMobile ? 30 : 50), // pop up
        rotate: 0,
        scale: isMobile ? 1.15 : 1.2,
        zIndex: 40,
      };
    }

    if (effectiveIndex !== null) {
      // When there's an active card, push other cards down and scale them down
      return {
        x: baseX,
        y: baseY + (isMobile ? 30 : 0),
        rotate: baseRotate,
        scale: isMobile ? 0.75 : 0.82,
        zIndex: 10 - Math.abs(virtualIndex),
      };
    }

    // Default fan state (when nothing is active/hovered)
    return {
      x: baseX,
      y: baseY,
      rotate: baseRotate,
      scale: isMobile ? 0.9 : 1,
      zIndex: 10 + index,
    };
  };

  // Card sizes
  const cardW = isMobile ? 150 : 220;
  const cardH = isMobile ? 230 : 340;

  return (
    <div className="min-h-[max(calc(100vh-144px),_900px)] flex flex-col items-center">
      {/* Card fan area */}
      <motion.div
        className="relative flex items-end justify-center mt-8 xl:mt-16"
        style={{
          width: isMobile ? 360 : 750,
          height: isMobile ? 320 : 320,
        }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleSwipe}
      >
        {initialCards.map((card, i) => {
          const transform = getCardTransform(i);
          const isCardActive = i === effectiveIndex;
          const isAnyActive = effectiveIndex !== null;

          return (
            <motion.div
              key={card.id}
              ref={isCardActive ? activeCardRef : undefined}
              onClick={() => handleClick(i)}
              className={clsx(
                "absolute cursor-pointer collection-card-item",
                {
                  "collection-card-active": isCardActive,
                }
              )}
              style={{
                width: cardW,
                height: cardH,
                left: '50%',
                bottom: 0,
                marginLeft: -cardW / 2,
                transformOrigin: 'center bottom',
              }}
              animate={{
                x: transform.x,
                y: transform.y,
                rotate: transform.rotate,
                scale: transform.scale,
                zIndex: transform.zIndex,
                opacity: isAnyActive && !isCardActive ? 0.7 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              whileHover={
                effectiveIndex === null
                  ? {
                    y: -20,
                    scale: isMobile ? 0.95 : 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 18 },
                  }
                  : undefined
              }
            >
              <div
                className={clsx(
                  "w-full h-full rounded-[20px] xl:rounded-[30px] overflow-hidden border-[6px] xl:border-8 border-white ",
                  {
                    "shadow-[1px_4px_10px_#53272763,3px_18px_18px_0px_#53272757,6px_40px_24px_0px_#53272733,12px_70px_28px_0px_#5327270F,18px_110px_31px_0px_#53272703]": isCardActive,
                    "border-0": !isCardActive
                  }
                )}
                style={{
                  transform: isCardActive ? 'perspective(1000px) rotateX(17deg)' : undefined,
                }}
              >
                {card.component(isCardActive)}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info section below cards */}
      <div className="flex flex-col items-center justify-center w-full px-6 mt-2 xl:mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center animate-fade-in"
          >
            {/* Dynamic custom icon support */}
            {displayCard.icon ? (
              <div className="flex justify-center mb-4">
                <img
                  src={displayCard.icon}
                  className="w-12 h-12 xl:w-16 xl:h-16 object-contain animate-fade-in"
                  alt="Custom icon"
                />
              </div>
            ) : (
              <div className={clsx('flex justify-center mb-4', displayCard.handle === "all" ? 'opacity-100' : 'opacity-100')}>
                <svg width="42" height="40" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8813 4.1458C21.6774 -1.38207 29.4979 -1.38206 31.294 4.1458L33.2211 10.0769C34.0244 12.5491 36.3281 14.2228 38.9275 14.2228H45.1638C50.9762 14.2228 53.3928 21.6605 48.6905 25.0769L43.6452 28.7425C41.5423 30.2704 40.6623 32.9786 41.4656 35.4508L43.3927 41.3819C45.1888 46.9097 38.8619 51.5065 34.1597 48.0901L29.1144 44.4244C27.0114 42.8966 24.1639 42.8966 22.0609 44.4244L17.0156 48.0901C12.3133 51.5065 5.98646 46.9097 7.78257 41.3819L9.70971 35.4508C10.513 32.9786 9.63301 30.2704 7.53008 28.7425L2.48477 25.0769C-2.21751 21.6605 0.199145 14.2228 6.01149 14.2228H12.2478C14.8472 14.2228 17.1509 12.5491 17.9542 10.0769L19.8813 4.1458Z" fill="#FFE977" />
                </svg>
              </div>
            )}

            <div className="flex items-center justify-center">
              <h2
                className="mb-1 font-centuryBook italic text-4xl xl:text-[100px] leading-normal xl:leading-[100px] text-center"
                dangerouslySetInnerHTML={{ __html: displayCard.title }}
              />
              {!displayCard.icon && (displayCard.handle === "thirsty" || displayCard.handle === "savouring") && (
                <div className="relative h-10 xl:h-16 w-10 xl:w-16 ml-2 xl:ml-4">
                  <img
                    className="animate-rotate-bounce absolute top-0 left-0 w-full h-full"
                    src="/assets/images/home/cup.svg"
                    alt={t('products.cupAlt')}
                  />
                  <img
                    className="reverse-animate-rotate-bounce absolute top-0 left-0 w-full h-full"
                    src="/assets/images/home/cup-bg.svg"
                    alt={t('products.cupAlt')}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="flex items-center gap-6">
          <button
            onClick={prev}
            className="p-2 xl:p-3 bg-yellow-300 rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronLeft size={isMobile ? 18 : 24} />
          </button>
          {/* <span className="font-title text-lg font-bold select-none min-w-[120px] text-center">
            {initialCards[activeIndex ?? 0]?.title}
          </span> */}

          <p className={clsx(
            "font-title font-medium text-2xl xl:text-[65px] leading-normal xl:leading-[85px] text-center",
            {
              "text-[#FFE977]": displayCard.handle === "all",
              "text-[#A2D4FD]": displayCard.handle !== "all",
            }
          )}>
            {displayCard.handle !== "coming" ? t('products.collection') : t('products.coming')}
          </p>
          <button
            onClick={next}
            className="p-2 xl:p-3 bg-yellow-300 rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronRight size={isMobile ? 18 : 24} />
          </button>
        </div>
      </div>

      {/* Product List Grid Area */}
      <Container className="w-full pb-32 mt-12 xl:mt-24">
        {displayCard.handle === "coming" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in w-full">
            <h3 className="font-centuryBook italic text-3xl xl:text-5xl text-[#000] mb-4">
              {t('products.stayTuned') || "Stay Tuned"}
            </h3>
            <p className="font-body text-gray-500 max-w-md">
              {t('products.comingDescription') || "We are crafting something magical for you. Follow us for updates!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full items-center lg:gap-24 gap-12 collections-index animate-fade-in">
            {collectionsWithProducts.map((collection) => (
              <div className="flex flex-col lg:gap-[34px] gap-6 w-full collections-index_item animate-fade-in" key={collection.id}>
                <div className="min-h-[54px] flex items-center justify-center">
                  <NavLink
                    to={`/collections/${collection.handle}`}
                    className="rounded-full bg-[#699BFF] text-white uppercase py-2.5 px-6 text-lg font-body font-bold hover:scale-105 transition-transform duration-200 min-w-[180px] text-center"
                  >
                    {collection.title}
                  </NavLink>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row w-full">
                  <div className="flex-1 w-full">
                    <ProductGrid products={collection.products as any} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
