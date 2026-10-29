import { config } from '@libs/util/server/config.server';
import { SitemapUrl } from '@libs/util/xml/sitemap-builder';
import { LoaderFunctionArgs } from 'react-router';

const getBaseUrl = (request: Request) => {
  try {
    const configuredUrl = new URL((config.STOREFRONT_URL || '').trim());
    if (configuredUrl.protocol === 'http:' || configuredUrl.protocol === 'https:') return configuredUrl.origin;
  } catch {
    // Local development falls back to the request origin.
  }

  return new URL(request.url).origin;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const baseUrl = getBaseUrl(request);

  const urls: SitemapUrl[] = [
    { loc: `${baseUrl}/sitemap-products.xml` },
    { loc: `${baseUrl}/sitemap-collections.xml` },
    { loc: `${baseUrl}/sitemap-pages.xml` },
  ];

  const content = `
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc }) => `<sitemap><loc>${loc}</loc></sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
