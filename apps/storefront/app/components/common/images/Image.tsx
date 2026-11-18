import clsx from 'clsx';
import { FC, ImgHTMLAttributes } from 'react';
import { DEFAULT_IMAGE_MAX_WIDTH, getImageSrcSet, getOptimizedImageUrl } from '@libs/util/images';
import { ImageBase } from './ImageBase';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  sources?: {
    src: string;
    media?: string;
  }[];
  alt?: string;
  fallbackSrc?: string[];
  /** Largest rendered width in CSS px (use ~2x for retina). Caps the downloaded size of uploaded images. */
  maxWidth?: number;
}

export const Source = ({
  src,
  media,
}: {
  src: string;
  media?: string;
}) => {
  return <source media={media} src={src} />;
};

export const Image: FC<ImageProps> = ({
  src,
  sources,
  className,
  maxWidth = DEFAULT_IMAGE_MAX_WIDTH,
  srcSet,
  fallbackSrc,
  ...rest
}) => {
  if (!src && !sources?.length) return null;

  const defaultSrc = src || (sources && sources[sources.length - 1].src);
  const optimizedSrc = getOptimizedImageUrl(defaultSrc, { width: maxWidth });
  const optimized = optimizedSrc !== defaultSrc;

  return (
    <picture>
      {sources?.map(({ src, media }) =>
        src && src !== defaultSrc ? <Source key={src} src={src} media={media} /> : null,
      )}
      <ImageBase
        className={clsx(`mkt-image`, className)}
        src={optimizedSrc}
        srcSet={srcSet ?? getImageSrcSet(defaultSrc, maxWidth)}
        // If the transformation fails, fall back to the original upload.
        fallbackSrc={optimized && defaultSrc ? [defaultSrc, ...(fallbackSrc ?? [])] : fallbackSrc}
        {...rest}
      />
    </picture>
  );
};
