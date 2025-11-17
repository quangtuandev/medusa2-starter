import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { AllCollection } from "@app/components/collection/items/all-collection";
import { ThirstyCollection } from "@app/components/collection/items/thirsty-collection";
import { IcyCollection } from "@app/components/collection/items/icy-collection";
import { ComingCollection } from "@app/components/collection/items/coming-collection";

const initialCards = [
  {
    id: 4, h1: "NEW MAGIC",
    animate: { x: '90px', y: '280px', rotate: '35deg', zIndex: 0, skewX: -25, skewY: 10 },
    title: "Coming", component: () => <ComingCollection isActive={false} className="w-[230px] h-[380px] h-sm:w-[184px] h-sm:h-[304px]" />
  },
  {
    id: 3, h1: "THIS IS OUR",
    animate: { x: '100px', y: '155px', rotate: '10deg', zIndex: 0, skewX: -15, skewY: 0 },
    title: "Icy", component: () => <IcyCollection isActive={false} className="w-[230px] h-[380px] h-sm:w-[184px] h-sm:h-[304px]" />
  },
  {
    id: 2, h1: "THIS IS OUR",
    animate: { x: '-100px', y: '55px', rotate: '-10deg', zIndex: 0, skewX: 15, skewY: 0 },
    title: "Thirsty", component: () => <ThirstyCollection isActive={false} className="w-[200px] h-[330px] h-sm:w-[164px] h-sm:h-[270px]" />
  },
  {
    id: 1, h1: "THIS IS",
    animate: { x: 0, y: 0, rotate: '-10deg', zIndex: 0, skewX: 3, skewY: 0 },
    title: "All", component: () => <AllCollection isActive={false} className="w-[200px] h-[336px] h-sm:w-[164px] h-sm:h-[276px]" />
  },
];

export default function PickACard() {
  const navigate = useNavigate();
  const [cards, _] = useState(initialCards);

  const handleClick = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen overflow-hidden xl:overflow-visible">
      <div className="z-10">
        < div className="flex flex-col items-center justify-center mt-16 xl:mt-0" >
          <h1 className="font-title xl:text-[110px] text-5xl text-center xl:text-left font-bold">THIS IS OUR</h1>
          <p className="font-centuryBook italic xl:text-[125px] text-5xl leading-[114px] text-center xl:text-left">Heart & Soul</p>
        </div >
      </div >
      <div className="flex items-center justify-center bg-white px-10 flex-col xl:h-[60vh] h-[calc(100vh-206px)] z-0">
        <div className="relative w-full hidden xl:flex justify-between items-center">
          <p className="font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-right">Pick <br /> a</p>
          <p className="font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-left">card</p>
        </div>
        <div className="relative xl:left-[-10vw] xl:top-[-100px] left-[25%] -translate-x-1/2 top-0 w-full xl:w-auto">
          <div className="relative w-full">

            {cards.map((card, i) => {
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleClick()}
                  className={clsx("absolute bottom-0 left-1/2 -translate-x-1/2")}
                  animate={card.animate}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >

                  {card.component()}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  );
}
