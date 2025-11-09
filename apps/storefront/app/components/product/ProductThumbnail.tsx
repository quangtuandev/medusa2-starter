import { Image } from '@app/components/common/images/Image';
import { StoreProduct } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import MorphingShape from '../generativeart/MorphingShape';
import { randomAssetMorphingShape } from '@libs/util/random';

export interface ProductThumbnailProps extends HTMLAttributes<HTMLElement> {
  product: StoreProduct;
  isTransitioning?: boolean;
  classNameImage?: string;
  isRemoveStyleDefault?: boolean;
}

export const ProductThumbnail: FC<ProductThumbnailProps> = ({ product, className, isTransitioning, classNameImage, isRemoveStyleDefault = false, ...props }) => {
  const thumbnailImage = (product.images && product.images[0] && product.images[0].url) || product.thumbnail;
  const hoverImage = product.images && product.images[1] && product.images[1].url;

  return (
    <figure
      className={clsx(
        'product-thumbnail overflow-hidden',
        !isRemoveStyleDefault && 'aspect-w-1 aspect-h-1 w-full',
        className,
      )}
      style={{
        viewTransitionName: isTransitioning ? 'product-thumbnail' : undefined,
      }}
      {...props}
    >
      <MorphingShape {...randomAssetMorphingShape(product.subtitle)} />
      {thumbnailImage ? (
        <Image
          loading="lazy"
          src={thumbnailImage}
          alt={product.title}
          className={clsx('h-full w-full object-cover object-center transition-all duration-300 -rotate-[14deg]', {
            'group-hover/product-card:opacity-75': !hoverImage,
          }, classNameImage,)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center object-cover object-center group-hover/product-card:opacity-75">
          No Image
        </div>
      )}
    </figure>
  );
};
