import { useAddToCart } from "@app/hooks/useAddToCart";
import { useCart } from "@app/hooks/useCart";
import { useI18n } from "@app/hooks/useI18n";
import { StoreProduct } from "@medusajs/types";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { type FC } from "react";

export interface QuickAddToCartProps {
  product: StoreProduct;
  className?: string;
  showText?: boolean;
}

/**
 * Quick Add to Cart component for simple products without options
 * For products with options, use AddToCartButton instead
 */
export const QuickAddToCart: FC<QuickAddToCartProps> = ({
  product,
  className,
  showText = false,
}) => {
  const { t } = useI18n();
  const { addToCart, isLoading } = useAddToCart();
  const { toggleCartDrawer } = useCart();

  // Check if product has options that require selection
  const hasRequiredOptions = product.options && product.options.length > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't allow quick add for products with options
    if (hasRequiredOptions) {
      return;
    }

    addToCart({
      productId: product.id,
      quantity: 1,
    });

    // Open cart drawer after adding item
    toggleCartDrawer(true);
  };

  // Don't render if product has required options
  if (hasRequiredOptions) {
    return null;
  }

  return (
    <button
      onClick={handleQuickAdd}
      disabled={isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200",
        "bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
        "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
        showText ? "px-4 py-2 text-sm" : "p-2",
        className
      )}
      aria-label={`${t('common.addToCart')} ${product.title}`}
    >
      <ShoppingBagIcon className={clsx("h-4 w-4", isLoading && "animate-pulse")} />
      {showText && (
        <span className="font-medium">
          {isLoading ? t('common.loading') : t('common.addToCart')}
        </span>
      )}
    </button>
  );
};
