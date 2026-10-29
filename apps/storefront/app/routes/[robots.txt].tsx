import { config } from '@libs/util/server/config.server';
import type { LoaderFunctionArgs } from 'react-router';

const getBaseUrl = (request: Request) => {
  try {
    const configuredUrl = new URL((config.STOREFRONT_URL || '').trim());
    if (configuredUrl.protocol === 'http:' || configuredUrl.protocol === 'https:') return configuredUrl.origin;
  } catch {
    // Local development falls back to the request origin.
  }

  return new URL(request.url).origin;
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  const baseUrl = getBaseUrl(request);
  const robotText = `
User-agent: *
Disallow: /orders
Disallow: /orders/
Disallow: /checkout
Disallow: /checkout/
Disallow: /preview/
Disallow: /api/
Disallow: /_auth/
Sitemap: ${baseUrl}/sitemap.xml
        `;
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
