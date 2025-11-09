import { useRegion } from "@app/hooks/useRegion";
import { StoreProduct } from "@medusajs/types";
import clsx from "clsx";
import { useState, type FC, type HTMLAttributes } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { ProductBadges } from "./ProductBadges";
import { ProductPrice } from "./ProductPrice";
import { ProductThumbnail } from "./ProductThumbnail";

export interface ProductSuggestionItemProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
}

const metaOptions = {
  SIZE: "Size",
};

export const ProductSuggestionItem: FC<ProductSuggestionItemProps> = ({
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

  const variant = product.variants?.find((variant) => {
    return Object.entries(selectedOptions).every(([optionId, value]) => variant.options?.some((v) => v.option_id === optionId && v.value === value));
  });
  if (!variant) return null;

  // Cho phép chọn bất cứ sản phẩm nào để thêm vào cart.
  // Nếu sản phẩm yêu cầu chọn size mà người dùng chưa chọn, chọn giá trị size đầu tiên mặc định.
  if (requiresSize && !selectedSize && size?.values?.length) {
    setSelectedSize(size.values[0].value);
    return null; // Ngăn render khi chưa lấy xong size mặc định
  }

  return (
    <article
      className={clsx(className, "text-left overflow-hidden flex")}
      {...props}
    >
      <ProductThumbnail isRemoveStyleDefault={true} isTransitioning={isTransitioning} product={product} className="!aspect-square !w-[200px] !h-[200px]" classNameImage=" !w-[200px] !h-[200px] !object-cover" />
      <div className="flex gap-2 justify-between items-center flex-col">
        <p>{product.title}  </p>
        <ProductPrice product={product} variant={variant} currencyCode={region.currency_code} />
        {selectedSize && (
          <span className="text-sm font-light border border-[#716E6E] rounded-full px-2 py-1 text-[10px] font-display leading-none">
            {selectedSize}
          </span>
        )}
        {size?.values?.map((value) => (
          <span
            key={value.id}
            className={clsx(
              "text-sm font-light  border border-[#716E6E] rounded-full px-2 py-1 text-[10px] font-display leading-none",
              {
                "!text-black !border-black bg-highlight": selectedSize === value.value,
              }
            )}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSize(value.value);
            }}
          >
            {value.value}
          </span>
        ))}
        <AddToCartButton
          product={product}
          selectedOptions={selectedOptions}
          disabled={!canAddToCart}
          variant="primary"
        />
      </div>
    </article>
  );
};
