import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@app/components/common/container/Container";
import { AllCollection } from "@app/components/collection/items/all-collection";
import { ThirstyCollection } from "@app/components/collection/items/thirsty-collection";
import { IcyCollection } from "@app/components/collection/items/icy-collection";
import { ComingCollection } from "@app/components/collection/items/coming-collection";

const initialCards = [
  { id: 4, h1: "NEW MAGIC", title: "Coming <br /> soon...", subtitle: "Stay tuned", component: (isActive: boolean) => <ComingCollection isActive={isActive} /> },
  { id: 3, h1: "THIS IS OUR", title: "Icy", subtitle: "Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices.", component: (isActive: boolean) => <IcyCollection isActive={isActive} /> },
  { id: 2, h1: "THIS IS OUR", title: "Thirsty", subtitle: "Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices.", component: (isActive: boolean) => <ThirstyCollection isActive={isActive} /> },
  { id: 1, h1: "THIS IS", title: "All of Our", subtitle: "", component: (isActive: boolean) => <AllCollection isActive={isActive} /> },
];

export default function HalfFanSlider() {
  const [cards, setCards] = useState(initialCards);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 || // Tablet and below
        'ontouchstart' in window || // Touch device
        navigator.maxTouchPoints > 0 || // Touch device
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = () => {
    handleClick(0);
  };

  const prev = () => {
    handleClick(0);
  };

  const handleClick = (clickedIndex: number) => {
    const clickedCard = cards[clickedIndex];
    const newCards = cards.filter((_, i) => i !== clickedIndex);
    setCards([...newCards, clickedCard]);
  };

  const activeCard = cards[cards.length - 1];

  const handleMouseEnter = (cardId: number) => {
    if (cardId !== activeCard.id) return;
    const collectionCardItem = document.querySelectorAll('.collection-card-item');
    const collectionCardTitle = document.querySelector('#collection-card-title') as HTMLDivElement;
    collectionCardTitle.style.opacity = '0.3';
    collectionCardItem.forEach((item: any) => {
      if (item.classList.contains('collection-card-active')) {
        item.style.opacity = '1';
        item.style.scale = '1.05';
      } else {
        item.style.opacity = '0.3';
      }
    });
  };

  const handleMouseLeave = (index: number) => {
    const collectionCardItem = document.querySelectorAll('.collection-card-item');
    const collectionCardTitle = document.querySelector('#collection-card-title') as HTMLDivElement;
    collectionCardTitle.style.opacity = '1';
    collectionCardItem.forEach((item: any) => {
      item.style.opacity = '1';
      item.style.scale = '1';
    });
  };

  return (
    <div className="min-h-[max(calc(100vh-144px),_900px)] flex flex-col">
      <Container className="flex items-center justify-between mt-4 xl:mt-16">
        <button
          onClick={prev}
          className="p-3 bg-yellow-300 rounded-full hover:scale-105 transition"
        >
          <ChevronLeft />
        </button>
        <div id="collection-card-title" className="flex items-center justify-center text-4xl xl:text-[110px] font-bold leading-normal xl:leading-[114px] text-center">
          {activeCard.h1}
        </div>
        <button
          onClick={next}
          className=" p-3 bg-yellow-300 rounded-full hover:scale-105 transition"
        >
          <ChevronRight />
        </button>
      </Container>
      <div className="flex items-center justify-end bg-white px-10 flex-1 flex-col-reverse xl:flex-row">
        <div className="relative xl:w-[535px] w-full mr-10 min-h-[310px] xl:min-h-0">
          {cards.map((card, i) => {

            const rotate = (i - (cards.length - 1)) * 18; // fan sang trái
            const x = (i - (cards.length - 1)) * (isMobile ? 120 : 185); // lệch sang trái
            const y = i === (cards.length - 1) ? (isMobile ? 40 : 55) : Math.abs(i - (cards.length - 1)) * (isMobile ? 60 : 80);
            const z = i * 10 - i;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleClick(i)}
                onMouseEnter={() => handleMouseEnter(card.id)}
                onMouseLeave={() => handleMouseLeave(card.id)}
                className={clsx("absolute bottom-0 xl:left-1/2 left-[20%] flex collection-card-item", {
                  "w-[150px] h-[250px] xl:w-[190px] xl:h-[310px]": i === 0,
                  "w-[160px] h-[260px] xl:w-[200px] xl:h-[320px]": i === 1,
                  "w-[170px] h-[270px] xl:w-[210px] xl:h-[330px]": i === 2,
                  "w-[220px] h-[340px] xl:w-[280px] xl:h-[400px]": i === 3,
                  "collection-card-active": card.id === activeCard.id,
                })}
                animate={{ x, y, rotate, zIndex: z, skewX: 4, skewY: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >

                {card.component(card.id === activeCard.id)}
              </motion.div>
            );
          })}
        </div>
        <div className="flex flex-col justify-center h-full items-center w-full xl:w-[650px] top-0 xl:top-[-100px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeCard.id === 1 && (
                <div className="flex justify-center mb-6">
                  <svg width="52" height="50" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.8813 4.1458C21.6774 -1.38207 29.4979 -1.38206 31.294 4.1458L33.2211 10.0769C34.0244 12.5491 36.3281 14.2228 38.9275 14.2228H45.1638C50.9762 14.2228 53.3928 21.6605 48.6905 25.0769L43.6452 28.7425C41.5423 30.2704 40.6623 32.9786 41.4656 35.4508L43.3927 41.3819C45.1888 46.9097 38.8619 51.5065 34.1597 48.0901L29.1144 44.4244C27.0114 42.8966 24.1639 42.8966 22.0609 44.4244L17.0156 48.0901C12.3133 51.5065 5.98646 46.9097 7.78257 41.3819L9.70971 35.4508C10.513 32.9786 9.63301 30.2704 7.53008 28.7425L2.48477 25.0769C-2.21751 21.6605 0.199145 14.2228 6.01149 14.2228H12.2478C14.8472 14.2228 17.1509 12.5491 17.9542 10.0769L19.8813 4.1458Z" fill="#FFE977" />
                  </svg>
                </div>
              )}
              <div className="flex items-center justify-center">
                <h2 className="mb-2 font-centuryBook italic text-4xl xl:text-[125px] leading-normal xl:leading-[114px] text-center" dangerouslySetInnerHTML={{ __html: activeCard.title }} />
                {(activeCard.id !== 1 && activeCard.id !== 4) && (
                  <div className="relative h-10 xl:h-20 w-10 xl:w-20">
                    <img
                      className="animate-rotate-bounce absolute top-0 left-0"
                      src="/assets/images/home/cup.svg"
                      alt="Cup"
                    />
                    <img
                      className="animate-rotate-bounce-reverse absolute top-0 left-0"
                      src="/assets/images/home/cup-bg.svg"
                      alt="Cup"
                    />
                  </div>
                )}
              </div>

              {activeCard.id !== 4 && (
                <p className={clsx("font-title font-medium text-2xl xl:text-[75.37px] leading-normal xl:leading-[95.47px] text-center", {
                  "text-[#FFE977]": activeCard.id === 1,
                  "text-[#A2D4FD]": activeCard.id !== 1,
                })}>collection</p>
              )}
              <p className="font-montserrat font-regular text-[15px] leading-normal xl:leading-[26px] text-center text-[#000] max-w-[430px]">{activeCard.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
