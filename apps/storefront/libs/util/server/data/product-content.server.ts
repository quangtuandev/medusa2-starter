import { toMedusaLocale } from '@libs/util/locale';
import { getLanguage } from '@libs/util/server/cookies.server';
import { baseMedusaConfig } from '@libs/util/server/client.server';

export type ProductContent = {
  id: string;
  product_id: string;
  notes: string;
  ingredients: string;
  precautions_of_use: string;
  application_tips: string;
};

export async function fetchProductContent(
  request: Request,
  productId: string,
): Promise<ProductContent | null> {
  const locale = toMedusaLocale(await getLanguage(request.headers));
  const url = new URL(
    `/store/products/${encodeURIComponent(productId)}/content`,
    baseMedusaConfig.baseUrl,
  );
  url.searchParams.set('locale', locale);

  const response = await fetch(url, {
    headers: {
      'x-publishable-api-key': baseMedusaConfig.publishableKey ?? '',
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch product content (${response.status})`);
  }

  const data = await response.json() as { product_content: ProductContent };
  return data.product_content;
}
