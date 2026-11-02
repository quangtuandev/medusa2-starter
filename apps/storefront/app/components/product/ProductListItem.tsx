import { useRegion } from "@app/hooks/useRegion";
import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { useEffect, useState, type FC, type HTMLAttributes } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { ProductBadges } from "./ProductBadges";
import { ProductPrice } from "./ProductPrice";
import { ProductThumbnail } from "./ProductThumbnail";

export interface ProductListItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
  forcedZoom?: number;
  isMobile?: boolean;
}

const metaOptions = {
  SIZE: "Size",
};

export const ProductListItem: FC<ProductListItemProps> = ({
  product,
  className,
  isTransitioning,
  forcedZoom = 0.35,
  isMobile = false,
  ...props
}) => {
  const { region } = useRegion();
  const size = product.options?.find(
    (option) => option.title?.toLowerCase() === metaOptions.SIZE.toLowerCase()
  );
  const defaultSizeValue = size?.values?.[0]?.value ?? null;
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSizeValue);

  useEffect(() => {
    setSelectedSize(defaultSizeValue);
  }, [product.id, defaultSizeValue]);

  // Match variant by selected size or fall back to first available variant
  const matchedVariant =
    product.variants?.find((v) =>
      selectedSize && size
        ? v.options?.some((opt) => opt.option_id === size.id && opt.value === selectedSize)
        : true
    ) ?? product.variants?.[0];

  if (!matchedVariant) return null;

  // Build full selectedOptions map from the matched variant so AddToCart always has all required options
  const selectedOptions: Record<string, string> = {};
  matchedVariant.options?.forEach((opt) => {
    if (opt.option_id && opt.value) {
      selectedOptions[opt.option_id] = opt.value;
    }
  });
  if (selectedSize && size?.id) {
    selectedOptions[size.id] = selectedSize;
  }

  const requiresSize = Boolean(size && size.values && size.values.length > 0);
  const hasNoPrice = !matchedVariant?.calculated_price?.calculated_amount;
  const canAddToCart = (!requiresSize || Boolean(selectedSize)) && !hasNoPrice;

  return (
    <article
      className={clsx(className, "group/product-card relative isolate text-left rounded-[32px] p-4 pb-6 overflow-hidden bg-white shadow-[5px_5px_10px_0px_#00000040]")}
      {...props}
    >
      <div className="relative z-0 mb-4 lg:mb-2">
        <ProductBadges
          className="absolute right-2 top-2 z-10 flex gap-2"
          product={product}
        />
        <ProductThumbnail variant={selectedSize ? matchedVariant : undefined} isTransitioning={isTransitioning} product={product} forcedZoom={forcedZoom} />
      </div>
      <h4 className="relative z-10 my-1 lg:my-4 overflow-hidden text-ellipsis font-extrabold font-title leading-none lg:group-hover/product-card:text-[36px] transition-all duration-300 text-sm lg:text-[28px]">
        {product.title}
      </h4>
      <div className="relative z-10 flex flex-col-reverse lg:flex-col gap-1">
        <div className="flex gap-2 justify-between items-center relative z-10">
          <div className="flex gap-2 justify-center items-center">
            {size?.values?.map((value) => (
              <span
                key={value.id}
                className={clsx(
                  "text-sm font-light border border-[#716E6E] rounded-full px-2 py-1 hover:text-[#716E6E] hover:border-black text-[8px] lg:text-sm font-display leading-none hover:bg-highlight cursor-pointer",
                  {
                    "!text-black !border-black bg-highlight": selectedSize === value.value,
                  }
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(value.value);
                }}
              >
                {value.value}
              </span>
            ))}
          </div>
          {!hasNoPrice && (
            <AddToCartButton
              product={product}
              selectedOptions={selectedOptions}
              disabled={!canAddToCart}
              variant="primary"
            />
          )}
        </div>
        <p className="mt-1 lg:text-lg text-[10px] font-extrabold font-title leading-none tracking-normal">
          <ProductPrice product={product} variant={matchedVariant} currencyCode={region.currency_code} />
        </p>
      </div>
    </article>
  );
};
