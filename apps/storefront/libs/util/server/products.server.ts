import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { HttpTypes } from '@medusajs/types';
import { MILLIS } from './cache-builder.server';
import { getSelectedRegion } from './data/regions.server';
import { getLanguage } from './cookies.server';
import { toMedusaLocale } from '../locale';
import { buildLocalizedCacheKey } from '../locale-cache';
import { fetchGiftConfig } from './gifts.server';

const listProducts = async (request: Request, { ...query }: HttpTypes.StoreProductListParams = {}) => {
  const region = await getSelectedRegion(request.headers);
  const locale = toMedusaLocale(await getLanguage(request.headers));

  return await cachified({
    key: buildLocalizedCacheKey('products', { query, regionId: region.id }, locale),
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return await sdk.store.product.list({
        ...query,
        region_id: region.id,
        locale,
      });
    },
  });
};

/** Shop products: the free-gift product is hidden everywhere (listings, search, product pages). */
export const fetchProducts = async (request: Request, query: HttpTypes.StoreProductListParams = {}) => {
  const [result, gift] = await Promise.all([listProducts(request, query), fetchGiftConfig()]);
  if (!gift?.productIds.length) return result;

  const products = result.products.filter((product) => !gift.productIds.includes(product.id));
  return { ...result, products, count: Math.max(result.count - (result.products.length - products.length), 0) };
};
