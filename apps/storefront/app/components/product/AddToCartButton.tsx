import { useAddToCart } from "@app/hooks/useAddToCart";
import { useCart } from "@app/hooks/useCart";
import { useI18n } from "@app/hooks/useI18n";
import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { type FC } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
export interface AddToCartButtonProps {
  product: StoreProduct;
  selectedOptions?: Record<string, string>;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isFullText?: boolean;
}

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  product,
  selectedOptions = {},
  quantity = 1,
  disabled = false,
  className,
  variant = "primary",
  size = "md",
  isFullText = false,
}) => {
  const { t } = useI18n();
  const { addToCart, isLoading } = useAddToCart();
  const { toggleCartDrawer } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      options: selectedOptions,
      quantity,
    });

    // Open cart drawer after adding item
    toggleCartDrawer(true);
  };

  const isDisabled = disabled || isLoading;

  const baseClasses =
    "font-medium rounded-[100px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center p-2";

  const variantClasses = {
    primary: {
      enabled: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
      disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
    },
    secondary: {
      enabled:
        "bg-white text-black border border-black hover:bg-gray-50 focus:ring-gray-500",
      disabled:
        "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed",
    },
  };

  const buttonClasses = clsx(
    baseClasses,
    isDisabled
      ? variantClasses[variant].disabled
      : variantClasses[variant].enabled,
    className
  );

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={clsx(buttonClasses, {
        "justify-center": isFullText,
      })}
      aria-label={`${t("common.addToCart")} ${product.title}`}
    >
      <i hidden={isFullText} className="w-4">
        <PlusIcon className="size-1" />
      </i>
      <span className={clsx(
        "text-nowrap btn-add ",
        {
          "text-center": isFullText,
          "opacity-0 w-0 h-0 transition-all duration-300 group-hover/product-card:opacity-100 group-hover/product-card:w-auto group-hover/product-card:h-auto": !isFullText,
        }
      )}> Add to cart</span>
    </button>
  );
};
