import { formatPrice, getVariantFinalPrice, getVariantPrices, sortProductVariantsByPrice } from '@libs/util/prices';
import { StoreProduct } from '@medusajs/types';
import { type FC, useMemo } from 'react';
import { ProductVariantPrice } from './ProductVariantPrice';

export interface ProductPriceRangeProps {
  product: StoreProduct;
  currencyCode: string;
}

export const ProductPriceRange: FC<ProductPriceRangeProps> = ({ product, currencyCode }) => {
  const sortedVariants = useMemo(() => sortProductVariantsByPrice(product), [product, currencyCode]);

  const minVariant = sortedVariants[0];
  const maxVariant = sortedVariants[sortedVariants.length - 1];

  const minPrice = useMemo(() => getVariantFinalPrice(minVariant), [sortedVariants]);
  const maxPrice = useMemo(() => getVariantFinalPrice(maxVariant), [sortedVariants]);

  const hasPriceRange = minPrice !== maxPrice;

  const originals = sortedVariants
    .map((v) => getVariantPrices(v).original)
    .filter((n): n is number => typeof n === 'number');
  const minOriginal = originals.length ? Math.min(...originals) : undefined;
  const maxOriginal = originals.length ? Math.max(...originals) : undefined;
  const hasSale = sortedVariants.some((v) => {
    const { calculated, original } = getVariantPrices(v);
    return typeof calculated === 'number' && typeof original === 'number' && calculated < original;
  });

  return (
    <>
      {hasPriceRange ? (
        <>
          {formatPrice(minPrice, { currency: currencyCode })}
          {maxPrice && maxPrice > minPrice ? <>&ndash;{formatPrice(maxPrice, { currency: currencyCode })}</> : ''}
          {hasSale && minOriginal !== undefined && (
            <s className="ml-1 text-gray-400">
              {formatPrice(minOriginal, { currency: currencyCode })}
              {maxOriginal !== undefined && maxOriginal > minOriginal ? (
                <>&ndash;{formatPrice(maxOriginal, { currency: currencyCode })}</>
              ) : null}
            </s>
          )}
        </>
      ) : (
        <ProductVariantPrice variant={minVariant} currencyCode={currencyCode} />
      )}
    </>
  );
};
