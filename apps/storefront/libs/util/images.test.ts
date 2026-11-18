import { getImageSrcSet, getOptimizedImageUrl, isTransformableImage } from './images';

const src = 'https://admin.kiraparfums.com/static/1794904405734-BRAND%20IDENTITY%20final.jpg';

describe('images', () => {
  it('rewrites uploaded images to a Cloudflare transformation URL', () => {
    expect(getOptimizedImageUrl(src, { width: 800 })).toBe(
      'https://admin.kiraparfums.com/cdn-cgi/image/width=800,quality=80,format=auto/static/1794904405734-BRAND%20IDENTITY%20final.jpg',
    );
  });

  it('leaves other hosts, other paths and local URLs untouched', () => {
    for (const other of [
      'https://example.com/static/a.jpg',
      'https://admin.kiraparfums.com/other/a.jpg',
      'http://localhost:7901/static/a.jpg',
      '/images/logo.png',
    ]) {
      expect(isTransformableImage(other)).toBe(false);
      expect(getOptimizedImageUrl(other, { width: 800 })).toBe(other);
      expect(getImageSrcSet(other)).toBeUndefined();
    }
  });

  it('builds a srcset capped at maxWidth', () => {
    const srcSet = getImageSrcSet(src, 700)!;
    expect(srcSet.split(', ').map((c) => c.split(' ')[1])).toEqual(['320w', '640w', '700w']);
  });
});
