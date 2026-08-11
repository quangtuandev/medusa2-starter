import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from '../cache-builder.server';
import { getLanguage } from '../cookies.server';
import { toMedusaLocale } from '../../locale';
import { buildLocalizedCacheKey } from '../../locale-cache';

export const listCategories = async function (request: Request) {
  const locale = toMedusaLocale(await getLanguage(request.headers));
  return cachified({
    key: buildLocalizedCacheKey('list-categories', {}, locale),
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listCategories(locale);
    },
  });
};

export const _listCategories = async function (locale?: string) {
  const query = { fields: '+category_children', locale };
  return sdk.store.category.list(query).then(({ product_categories }) => product_categories);
};
