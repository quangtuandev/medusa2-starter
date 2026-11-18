/**
 * Cloudflare Image Transformations (https://developers.cloudflare.com/images/transform-images/).
 * Only images served from these hosts under /static/ are rewritten; anything else is returned untouched.
 */
const TRANSFORMABLE_HOSTS = ['admin.kiraparfums.com'];
const TRANSFORMABLE_PATH_PREFIX = '/static/';

export const DEFAULT_IMAGE_MAX_WIDTH = 1600;
export const DEFAULT_IMAGE_WIDTHS = [320, 640, 960, 1280, 1600];

export interface OptimizedImageOptions {
  width: number;
  quality?: number;
}

export const isTransformableImage = (src?: string | null): src is string => {
  if (!src) return false;
  try {
    const url = new URL(src);
    return TRANSFORMABLE_HOSTS.includes(url.hostname) && url.pathname.startsWith(TRANSFORMABLE_PATH_PREFIX);
  } catch {
    return false;
  }
};

/** Resized, compressed, auto-format (AVIF/WebP) URL for an uploaded image; the original URL when not transformable. */
export const getOptimizedImageUrl = (src: string | undefined, { width, quality = 80 }: OptimizedImageOptions) => {
  if (!isTransformableImage(src)) return src;
  const url = new URL(src);
  return `${url.origin}/cdn-cgi/image/width=${Math.round(width)},quality=${quality},format=auto${url.pathname}${url.search}`;
};

/** `srcset` of width-descriptor candidates up to `maxWidth`, or undefined when the image is not transformable. */
export const getImageSrcSet = (src: string | undefined, maxWidth = DEFAULT_IMAGE_MAX_WIDTH) => {
  if (!isTransformableImage(src)) return undefined;
  const widths = [...new Set([...DEFAULT_IMAGE_WIDTHS.filter((w) => w < maxWidth), maxWidth])];
  return widths.map((width) => `${getOptimizedImageUrl(src, { width })} ${width}w`).join(', ');
};
