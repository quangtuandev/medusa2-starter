import { formatPrice, getVariantPrices } from '@libs/util/prices';
import { StoreProductVariant } from '@medusajs/types';
import isNumber from 'lodash/isNumber';
import { type FC } from 'react';

export interface ProductVariantPriceProps {
  variant: StoreProductVariant;
  currencyCode: string;
}

export const ProductVariantPrice: FC<ProductVariantPriceProps> = ({ variant, currencyCode }) => {
  const { original, calculated } = getVariantPrices(variant);

  const hasSale = isNumber(calculated) && calculated < (original ?? 0);

  return (
    <>
      {hasSale ? (
        <span className="inline-flex gap-1 flex-col">
          <s className="text-gray-400">{formatPrice(original || 0, { currency: currencyCode })}</s>
          <span>{formatPrice(calculated, { currency: currencyCode })}</span>
        </span>
      ) : (
        formatPrice(original || 0, { currency: currencyCode })
      )}
    </>
  );
};
