import { SiteSettings } from '@libs/types';
import { config } from '@libs/util/server/config.server';

export const siteSettings: SiteSettings = {
  storefront_url: config.STOREFRONT_URL,
  description: '',
  favicon: '/favicon.svg',
  social_facebook: 'https://www.facebook.com/kiraparfum',
  social_instagram: 'https://www.instagram.com/bykiraparfum',
  social_tiktok: 'https://www.tiktok.com/@kira.parfum',
};
