import { SiteSettings } from '@libs/types';
import { config } from '@libs/util/server/config.server';

export const siteSettings: SiteSettings = {
  storefront_url: config.STOREFRONT_URL,
  description: '',
  favicon: '/favicon.png',
  social_facebook: 'https://www.facebook.com/kiraparfums',
  social_instagram: 'https://www.instagram.com/kiraparfums',
  social_tiktok: 'https://www.tiktok.com/@kira.parfums',
};
