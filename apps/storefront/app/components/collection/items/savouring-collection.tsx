import clsx from "clsx";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { animate, spring } from "animejs";

export const SavouringCollection = ({ className, isActive }: { className?: string; isActive: boolean }) => {
  const collectionItemRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => {
    if (!isActive) return;
    animate(".savouring-main-image", {
      opacity: [1, 0],
      width: "0%",
      ease: spring({ bounce: 0.65, duration: 400 }),
      duration: 300,
    });
    animate(".savouring-second-image", {
      opacity: [0, 1],
      ease: spring({ bounce: 0.65, duration: 400 }),
      duration: 300,
    });
  };

  const handleMouseLeave = () => {
    if (!isActive) return;
    animate(".savouring-main-image", {
      opacity: [0, 1],
      width: "100%",
      ease: spring({ bounce: 0.65, duration: 400 }),
      duration: 300,
    });
    animate(".savouring-second-image", {
      opacity: [1, 0],
      ease: spring({ bounce: 0.65, duration: 400 }),
      duration: 300,
    });
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (!isActive) return;
    navigate("/collections/savouring");
  };

  return (
    <div
      ref={collectionItemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={clsx("collection-item flex overflow-hidden w-full h-full cursor-pointer relative", className)}
    >
      <img
        src="/assets/images/home/savouring-collection.png"
        className="scale-110 object-cover savouring-main-image w-full h-full"
        alt="Savouring Collection"
      />
      <img
        src="/assets/images/home/savouring-collection.webp"
        className="scale-110 object-cover savouring-second-image opacity-0 absolute top-0 left-0 w-full h-full"
        alt="Savouring Collection Detail"
      />
    </div>
  );
};
