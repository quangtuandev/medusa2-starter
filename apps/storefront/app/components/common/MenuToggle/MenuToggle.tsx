import clsx from "clsx";
import { FC } from "react";

export interface MenuToggleProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

export const MenuToggle: FC<MenuToggleProps> = ({
  isOpen,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center w-[55px] h-[55px] rounded-full transition-all text-[#000000]",
        "duration-300 ease-in-out",
        {
          "bg-[#FDCEF8]": isOpen,
          "bg-[#FFFF00]": !isOpen,
        },
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <img src="/assets/images/icons/close.svg" alt="Close" />
      ) : (
        <img src="/assets/images/icons/menu.svg" alt="Menu" />
      )}
    </button>
  );
};
