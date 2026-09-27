import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router";

export interface DynamicCollectionProps {
  image?: string;
  imageActive?: string;
  title: string;
  linkto?: string;
  isActive: boolean;
  isAnyActive?: boolean;
  className?: string;
}

export const DynamicCollection: React.FC<DynamicCollectionProps> = ({
  image,
  imageActive,
  title,
  linkto,
  isActive,
  isAnyActive,
  className,
}) => {
  const navigate = useNavigate();

  // If card is active, automatically show the active image
  const showActiveDirectly = Boolean(imageActive) && isActive;
  // If card is not active and no card is active (fanned out), allow hover to reveal active image
  const isHoverEnabled = Boolean(imageActive) && !isActive && !isAnyActive;

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) return;
    if (linkto) {
      e.stopPropagation();
      navigate(linkto);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group relative flex overflow-hidden w-full h-full select-none",
        isActive ? "cursor-pointer" : "",
        className
      )}
    >
      {image ? (
        <img
          src={image}
          className={clsx(
            "scale-110 object-cover w-full h-full select-none pointer-events-none transition-opacity duration-300 ease-in-out",
            showActiveDirectly
              ? "opacity-0"
              : isHoverEnabled
              ? "opacity-100 group-hover:opacity-0"
              : "opacity-100"
          )}
          alt={title}
        />
      ) : null}

      {imageActive ? (
        <img
          src={imageActive}
          className={clsx(
            "scale-110 object-cover w-full h-full select-none pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out",
            showActiveDirectly
              ? "opacity-100"
              : isHoverEnabled
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          alt={`${title} Active`}
        />
      ) : null}
    </div>
  );
};
