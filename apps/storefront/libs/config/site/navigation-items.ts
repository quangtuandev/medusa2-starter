import { NavigationCollection, NavigationItemLocation } from '@libs/types';

// Navigation items with i18n keys instead of hardcoded labels
export const headerNavigationItems: NavigationCollection = [
  {
    id: 1,
    label: 'navigation.products', // i18n key
    url: '/pick-a-card',
    sort_order: 0,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 2,
    label: 'navigation.aboutUs', // i18n key
    url: '/stories',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 3,
    label: 'navigation.store', // i18n key
    url: '/store',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 4,
    label: 'navigation.blog', // i18n key
    url: '/blogs',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
  {
    id: 5,
    label: 'navigation.letsTalk', // i18n key
    url: '/contact',
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false,
  },
];

export const footerNavigationItems: NavigationCollection = [
  {
    id: 1,
    label: 'navigation.aboutUs', // i18n key
    url: '/stories',
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false,
  },
  {
    id: 2,
    label: 'navigation.faqs', // i18n key
    url: '/faqs',
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false,
  },
  {
    id: 3,
    label: 'navigation.documentation', // i18n key
    url: '/docs',
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false,
  },
  {
    id: 4,
    label: 'navigation.termsOfService', // i18n key
    url: '/terms-of-service',
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false,
  },
];
