import { getOptimizedImageUrl } from "@libs/util/images";
import clsx from "clsx";
import React from "react";

export interface DynamicCollectionProps {
  image?: string;
  imageActive?: string;
  title: string;
  isActive: boolean;
  isAnyActive?: boolean;
  className?: string;
}

/** Fan cards render at most ~216 CSS px wide (focused), so 720px covers 3x displays. */
const CARD_IMAGE_WIDTH = 720;

/**
 * Retry once with the original upload if the resized version fails; only a broken
 * original is hidden, so a broken admin image never paints the alt text over the card.
 */
const handleImageError = (original: string) => (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (img.dataset.fallback !== "1" && img.getAttribute("src") !== original) {
    img.dataset.fallback = "1";
    img.src = original;
    return;
  }
  img.style.visibility = "hidden";
};

/**
 * Purely presentational collection card: opening a collection is decided by the
 * slider that owns the cards (see HalfFanSlider), so a card whose collection does
 * not exist yet can stay inert instead of bouncing the visitor around.
 */
export const DynamicCollection: React.FC<DynamicCollectionProps> = ({
  image,
  imageActive,
  title,
  isActive,
  isAnyActive,
  className,
}) => {
  // If card is active, automatically show the active image
  const showActiveDirectly = Boolean(imageActive) && isActive;
  // If card is not active and no card is active (fanned out), allow hover to reveal active image
  const isHoverEnabled = Boolean(imageActive) && !isActive && !isAnyActive;

  return (
    <div
      className={clsx(
        "group relative flex overflow-hidden w-full h-full select-none",
        isActive ? "cursor-pointer" : "",
        className
      )}
    >
      {image ? (
        <img
          src={getOptimizedImageUrl(image, { width: CARD_IMAGE_WIDTH })}
          onError={handleImageError(image)}
          className={clsx(
            "object-cover w-full h-full select-none pointer-events-none transition-opacity duration-300 ease-in-out",
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
          src={getOptimizedImageUrl(imageActive, { width: CARD_IMAGE_WIDTH })}
          onError={handleImageError(imageActive)}
          className={clsx(
            "object-cover w-full h-full select-none pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out",
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
