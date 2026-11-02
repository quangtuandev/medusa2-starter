import { Image } from '@app/components/common/images/Image';
import { StoreProduct, StoreProductVariant } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes, useEffect, useMemo } from 'react';
import MorphingShape from '../generativeart/MorphingShape';
import { getProductMorphingShape } from '@libs/util/random';

export interface ProductThumbnailProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
  classNameImage?: string;
  isRemoveStyleDefault?: boolean;
  forcedZoom?: number;
  variant?: StoreProductVariant;
}

export const ProductThumbnail: FC<ProductThumbnailProps> = ({ product, className, isTransitioning, classNameImage, isRemoveStyleDefault = false, forcedZoom, variant, ...props }) => {
  const hoverImage = product.images && product.images[1] && product.images[1].url;
  const thumbnailImage = useMemo(() => {
    return variant?.thumbnail || (product.images && product.images[0] && product.images[0].url)
      || product.thumbnail || product.variants?.[0]?.thumbnail || '';
  }, [variant?.thumbnail]);
  return (
    <figure
      className={clsx(
        'product-thumbnail relative isolate',
        !isRemoveStyleDefault && 'aspect-w-1 aspect-h-1 w-full',
        className,
      )}
      style={{
        viewTransitionName: isTransitioning ? 'product-thumbnail' : undefined,
      }}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <MorphingShape {...getProductMorphingShape(product)} zoom={forcedZoom} classNameWrapper={clsx(isRemoveStyleDefault && '!h-auto')} />
      </div>
      {thumbnailImage ? (
        <Image
          key={thumbnailImage}
          loading="lazy"
          src={thumbnailImage}
          alt={product.title}
          className={clsx('relative z-10 h-full w-full object-cover object-center transition-all duration-300 -rotate-[14deg]', {
            'group-hover/product-card:opacity-75': !hoverImage,
            'top-[-200px]': isRemoveStyleDefault,
          }, classNameImage,)}
        />
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center object-cover object-center group-hover/product-card:opacity-75">
          No Image
        </div>
      )}
    </figure>
  );
};
