import type { SiteDetailsRootData } from '@libs/types';

import { headerNavigationItems } from '@libs/config/site/navigation-items';
import { siteSettings } from '@libs/config/site/site-settings';
import { NavigationItemLocation } from '@libs/types';
import { listPublishedPages } from '@libs/util/server/pages.server';
import type { HttpTypes } from '@medusajs/types';
import { type LoaderFunctionArgs, data as remixData } from 'react-router';
import { RemixLoaderResponse } from 'types/remix';
import { config } from './config.server';
import { getCookie, getSelectedRegionId, setSelectedRegionId } from './cookies.server';
import { enrichLineItems, retrieveCart } from './data/cart.server';
import { fetchCollections } from './data/collections.server';
import { getCustomer } from './data/customer.server';
import { getSelectedRegion, listRegions } from './data/regions.server';
import { fetchProducts } from './products.server';

const fetchHasProducts = async (request: Request) => {
  return await fetchProducts(request, { limit: 1, offset: 999_999 }).then((res) => res.count > 0);
};

export const getRootLoader = async ({ request }: LoaderFunctionArgs) => {
  const region = await getSelectedRegion(request.headers);

  const language = await getCookie(request.headers, 'lng') || 'en';

  const [cart, regions, customer, hasPublishedProducts, publishedPages, collectionsData] = await Promise.all([
    retrieveCart(request),
    listRegions(),
    getCustomer(request),
    fetchHasProducts(request),
    listPublishedPages(language),
    fetchCollections(request),
  ]);

  const headers = new Headers();

  const currentRegionCookieId = await getSelectedRegionId(headers);

  if (currentRegionCookieId !== region?.id) {
    await setSelectedRegionId(headers, region?.id!);
  }

  if (cart?.items?.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id!);
    cart.items = enrichedItems as HttpTypes.StoreCartLineItem[];
  }

  const fontLinks: string[] = [];

  return remixData(
    {
      hasPublishedProducts,
      fontLinks,
      env: {
        NODE_ENV: config.NODE_ENV,
        ENVIRONMENT: config.ENVIRONMENT,
        STRIPE_PUBLIC_KEY: config.STRIPE_PUBLIC_KEY,
        PAYPAL_CLIENT_ID: config.PAYPAL_CLIENT_ID,
        PUBLIC_MEDUSA_API_URL: config.PUBLIC_MEDUSA_API_URL,
        STOREFRONT_URL: config.STOREFRONT_URL,
        SENTRY_DSN: config.SENTRY_DSN,
        SENTRY_ENVIRONMENT: config.SENTRY_ENVIRONMENT,
        EVENT_LOGGING: config.EVENT_LOGGING,
      },
      customer,
      regions,
      region,
      siteDetails: {
        store: {
          name: 'KIRAPARFUMS',
        },
        settings: siteSettings,
        headerNavigationItems,
        footerNavigationItems: [
          // Static "About Us" — always first
          {
            id: 1,
            label: 'navigation.aboutUs',
            url: '/stories',
            location: NavigationItemLocation.footer,
            sort_order: 0,
            new_tab: false,
          },
          // Dynamic pages from CMS
          ...publishedPages.map((page, index) => ({
            id: 100 + index,
            label: page.title,
            url: `/pages/${page.slug}`,
            new_tab: false,
            location: NavigationItemLocation.footer,
            sort_order: index + 1,
          })),
        ],
      } as SiteDetailsRootData,
      collections: collectionsData?.collections || [],
      cart: cart,
    },
    { headers },
  );
};

export type RootLoader = typeof getRootLoader;

export type RootLoaderResponse = RemixLoaderResponse<typeof getRootLoader>['data'];
