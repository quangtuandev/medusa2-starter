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
    title: "Coming", component: () => <ComingCollection isActive={false} className="w-[230px] h-[380px]" />
  },
  {
    id: 3, h1: "THIS IS OUR",
    animate: { x: '100px', y: '155px', rotate: '10deg', zIndex: 0, skewX: -15, skewY: 0 },
    title: "Icy", component: () => <IcyCollection isActive={false} className="w-[230px] h-[380px]" />
  },
  {
    id: 2, h1: "THIS IS OUR",
    animate: { x: '-100px', y: '55px', rotate: '-10deg', zIndex: 0, skewX: 15, skewY: 0 },
    title: "Thirsty", component: () => <ThirstyCollection isActive={false} className="w-[200px] h-[330px]" />
  },
  {
    id: 1, h1: "THIS IS",
    animate: { x: 0, y: 0, rotate: '-10deg', zIndex: 0, skewX: 3, skewY: 0 },
    title: "All", component: () => <AllCollection isActive={false} className="w-[200px] h-[336px]" />
  },
];

export default function PickACard() {
  const navigate = useNavigate();
  const [cards, _] = useState(initialCards);

  const handleClick = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen ">
      <div className="">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-title text-[110px] font-bold">THIS IS OUR</h1>
          <p className="font-centuryBook italic text-[125px] leading-[114px]">Heart & Soul</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-10 flex-col h-[60vh]">
        <div className="relative w-full flex justify-between items-center">
          <p className="font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-right">Pick <br /> a</p>
          <p className="font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-left">card</p>
        </div>
        <div className="relative left-[-10vw] top-[-100px]">

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
  );
}
