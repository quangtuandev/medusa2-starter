import cachified from '@epic-web/cachified';
import { sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from './cache-builder.server';

export type HomepageHero = {
  /** Record id (used as the React key while slides swap). */
  id?: string;
  title: string;
  subtitle: string;
  image_desktop_url: string;
  image_mobile_url?: string | null;
  cta_label: string;
  cta_href: string;
  cta_variant: 'primary' | 'outline' | 'glass';
  text_color: string;
  text_align: 'left' | 'center';
};

export type HomepageBestSellerItem = {
  product_id?: string | null;
  image_url: string;
  link: string;
  alt: string;
  rank: number;
};

export type HomepageBestSeller = {
  heading: string;
  description: string;
  items: HomepageBestSellerItem[];
};

export type HomepageConfig = {
  /** Hero carousel slides, in display order (always at least one). */
  heroes: HomepageHero[];
  best_seller: HomepageBestSeller;
};

/**
 * Design defaults, also used as a safety net when the backend has no homepage
 * records yet (or is unreachable). Keeping them here means the page always
 * renders — LCP and layout are never blocked on the CMS.
 */
const DEFAULT_HERO: HomepageHero = {
  id: 'default-rice-milk',
  title: 'RiCE MILK',
  subtitle: 'eau de parfums | 50ML',
  image_desktop_url: '/assets/images/home/hero-rice-milk.webp',
  image_mobile_url: '/assets/images/home/hero-rice-milk.webp',
  cta_label: 'SHOP NOW',
  cta_href: '/products',
  cta_variant: 'primary',
  text_color: '#FFFFFF',
  text_align: 'left',
};

/** Two extra slides so a fresh install already shows a working carousel. */
const DEFAULT_SLIDES: HomepageHero[] = [
  DEFAULT_HERO,
  {
    ...DEFAULT_HERO,
    id: 'default-coffeeling',
    title: 'COFFEELING',
    image_desktop_url: '/assets/images/menu/product.webp',
    image_mobile_url: '/assets/images/menu/product.webp',
  },
  {
    ...DEFAULT_HERO,
    id: 'default-matcha',
    title: 'MATCHA LATTE',
    image_desktop_url: '/assets/images/menu/contact.webp',
    image_mobile_url: '/assets/images/menu/contact.webp',
  },
];

export const HOMEPAGE_DEFAULTS: HomepageConfig = {
  heroes: DEFAULT_SLIDES,
  best_seller: {
    heading: 'BEST SELLER',
    description: 'Our most loved scents — hand-poured in small batches and loved the most by you.',
    items: [
      {
        image_url: '/assets/images/menu/product.webp',
        link: '/products',
        alt: 'RiCE MILK',
        rank: 0,
      },
      {
        image_url: '/assets/images/menu/story.webp',
        link: '/products',
        alt: 'Coffeeling',
        rank: 1,
      },
      {
        image_url: '/assets/images/menu/contact.webp',
        link: '/products',
        alt: 'Matcha Latte',
        rank: 2,
      },
      {
        image_url: '/assets/images/home/thirsty1.webp',
        link: '/products',
        alt: 'Thirsty',
        rank: 3,
      },
      {
        image_url: '/assets/images/home/icy1.webp',
        link: '/products',
        alt: 'Icy',
        rank: 4,
      },
      {
        image_url: '/assets/images/home/savouring-collection.webp',
        link: '/products',
        alt: 'Savouring',
        rank: 5,
      },
    ],
  },
};

const VI_DEFAULTS: HomepageConfig = {
  ...HOMEPAGE_DEFAULTS,
  heroes: HOMEPAGE_DEFAULTS.heroes.map((slide) => ({
    ...slide,
    cta_label: slide.cta_label === 'SHOP NOW' ? 'MUA NGAY' : slide.cta_label,
  })),
  best_seller: {
    ...HOMEPAGE_DEFAULTS.best_seller,
    heading: 'BÁN CHẠY NHẤT',
    description: 'Những mùi hương được yêu thích nhất — chiết xuất thủ công theo từng mẻ nhỏ.',
  },
};

const MAX_BEST_SELLER_ITEMS = 6;

const MAX_HERO_SLIDES = 8;

const withDefaults = (data: Partial<HomepageConfig> | null | undefined, lang: string): HomepageConfig => {
  const fallback = lang === 'vi' ? VI_DEFAULTS : HOMEPAGE_DEFAULTS;
  if (!data) return fallback;

  const fallbackSlide = fallback.heroes[0];

  const heroes = (data.heroes || [])
    .filter((slide) => !!slide?.image_desktop_url)
    .map((slide) => ({ ...fallbackSlide, ...slide }))
    .slice(0, MAX_HERO_SLIDES) as HomepageHero[];

  const bestSeller = { ...fallback.best_seller, ...(data.best_seller || {}) };

  const items = (bestSeller.items || [])
    .filter((item) => !!item?.image_url)
    .map((item, index) => ({
      ...item,
      link: item.link || '/products',
      alt: item.alt || '',
      rank: typeof item.rank === 'number' ? item.rank : index,
    }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_BEST_SELLER_ITEMS) as HomepageBestSellerItem[];

  return {
    heroes: heroes.length ? heroes : fallback.heroes,
    best_seller: {
      ...bestSeller,
      items: items.length ? items : fallback.best_seller.items,
    },
  };
};

const requestHomepage = async (lang: string): Promise<HomepageConfig | null> => {
  const baseUrl = process.env.INTERNAL_MEDUSA_API_URL || process.env.PUBLIC_MEDUSA_API_URL || 'http://localhost:7901';
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || '';

  try {
    const response = await fetch(`${baseUrl}/store/homepage?lang=${lang}`, {
      headers: {
        'x-publishable-api-key': publishableKey,
        'x-language': lang,
      },
    });

    if (!response.ok) {
      console.error('[homepage] store endpoint responded', response.status);
      return null;
    }

    const data = await response.json();
    // `hero_slides` is the carousel; `hero` is the first slide (older payloads).
    const heroes =
      Array.isArray(data.hero_slides) && data.hero_slides.length ? data.hero_slides : [data.hero].filter(Boolean);

    return withDefaults({ heroes, best_seller: data.best_seller }, lang);
  } catch (error) {
    console.error('[homepage] could not reach the backend', error);
    return null;
  }
};

/**
 * Homepage CMS payload (hero + best seller). Cached for 10s with a 1h stale
 * window so admin edits land quickly without hitting the API on every request.
 * `?preview=1` bypasses the cache entirely.
 */
export const fetchHomepageConfig = async (request?: Request): Promise<HomepageConfig> => {
  const url = request ? new URL(request.url) : null;
  const lang = (url?.searchParams.get('lang') === 'vi' ? 'vi' : null) ?? 'en';
  const isPreview = url?.searchParams.get('preview') === '1';

  if (isPreview) {
    return (await requestHomepage(lang)) ?? (lang === 'vi' ? VI_DEFAULTS : HOMEPAGE_DEFAULTS);
  }

  const config = await cachified({
    key: `homepage-config-${lang}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    getFreshValue: () => requestHomepage(lang),
  });

  return config ?? (lang === 'vi' ? VI_DEFAULTS : HOMEPAGE_DEFAULTS);
};
