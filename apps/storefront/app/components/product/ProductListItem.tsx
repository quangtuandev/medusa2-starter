import { useRegion } from "@app/hooks/useRegion";
import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { useState, type FC, type HTMLAttributes } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { ProductBadges } from "./ProductBadges";
import { ProductPrice } from "./ProductPrice";
import { ProductThumbnail } from "./ProductThumbnail";

export interface ProductListItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

const metaOptions = {
  SIZE: "Size",
};

export const ProductListItem: FC<ProductListItemProps> = ({
  product,
  className,
  isTransitioning,
  ...props
}) => {
  const { region } = useRegion();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const size = product.options?.find(
    (option) => option.title === metaOptions.SIZE
  );

  // Build selected options for AddToCartButton
  const selectedOptions: Record<string, string> = {};
  if (selectedSize && size) {
    selectedOptions[size?.id] = selectedSize;
  }

  // Check if product requires size selection
  const requiresSize = size && size.values && size.values.length > 0;
  const canAddToCart = !requiresSize || selectedSize;
  // box-shadow: 5.23px 5.23px 9.33px 0px #00000040;

  return (
    <article
      className={clsx(className, "group/product-card text-left rounded-[32px] p-4 overflow-hidden bg-white shadow-[5px_5px_10px_0px_#00000040]")}
      {...props}
    >
      <div className="relative">
        <ProductBadges
          className="absolute right-2 top-2 z-10 flex gap-2"
          product={product}
        />
        <ProductThumbnail isTransitioning={isTransitioning} product={product} />
      </div>
      <h4 className="mt-4 overflow-hidden text-ellipsis text-sm font-extrabold font-title">
        {product.title}
      </h4>
      <div className="flex gap-2">
        {size?.values?.map((value) => (
          <span
            key={value.id}
            className={clsx(
              "text-sm font-light  border border-[#716E6E] rounded-full px-2 py-1 hover:text-[#716E6E] hover:border-black text-[10px] font-display leading-none",
              {
                "!text-black !border-black": selectedSize === value.value,
              }
            )}
            onClick={(e) => {
              setSelectedSize(value.value);
              e.preventDefault();
            }}
          >
            {value.value}
          </span>
        ))}
      </div>
      <p className="mt-1 text-lg font-light">
        <ProductPrice product={product} currencyCode={region.currency_code} />
      </p>

      <AddToCartButton
        product={product}
        selectedOptions={selectedOptions}
        disabled={!canAddToCart}
        variant="primary"
      />
    </article>
  );
};
