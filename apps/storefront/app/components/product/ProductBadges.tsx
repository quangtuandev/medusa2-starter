import { SoldOutBadge } from '@app/components/badges/SoldOutBadge';
import { useProductInventory } from '@app/hooks/useProductInventory';
import { StoreProduct } from '@medusajs/types';
import { getVariantPrices } from '@libs/util/prices';
import { FC, HTMLAttributes } from 'react';

interface ProductBadgesProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  className?: string;
}

export const ProductBadges: FC<ProductBadgesProps> = ({ product, className }) => {
  const productInventory = useProductInventory(product);
  const isSoldOut = productInventory.averageInventory === 0;

  const maxDiscountPercent = Math.max(
    0,
    ...(product.variants ?? []).map((v) => {
      const { calculated, original } = getVariantPrices(v);
      if (typeof calculated !== 'number' || typeof original !== 'number' || original <= 0 || calculated >= original) {
        return 0;
      }
      return Math.round((1 - calculated / original) * 100);
    }),
  );

  return (
    <div className={className}>
      {isSoldOut && <SoldOutBadge />}
      {!isSoldOut && maxDiscountPercent > 0 && (
        <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white">
          -{maxDiscountPercent}%
        </span>
      )}
    </div>
  );
};
