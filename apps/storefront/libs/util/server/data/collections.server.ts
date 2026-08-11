import cachified from '@epic-web/cachified';
import { medusaError } from '@libs/util/medusaError';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { HttpTypes } from '@medusajs/types';
import { MILLIS } from '../cache-builder.server';
import { getLanguage } from '../cookies.server';
import { toMedusaLocale } from '../../locale';
import { buildLocalizedCacheKey } from '../../locale-cache';

export const retrieveCollection = async function (id: string) {
  return sdk.store.collection.retrieve(id, {}).then(({ collection }) => collection);
};

export const fetchCollections = async function (
  request: Request,
  offset: number = 0,
  limit: number = 100,
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  const locale = toMedusaLocale(await getLanguage(request.headers));
  return cachified({
    key: buildLocalizedCacheKey('collections', { offset, limit }, locale),
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _fetchCollections(offset, limit, locale);
    },
  });
};

export const _fetchCollections = async function (
  offset: number = 0,
  limit: number = 100,
  locale?: string,
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> {
  const query = { limit, offset, fields: 'id,handle,title,metadata', locale };
  return sdk.store.collection
    .list(query)
    .then(({ collections }) => ({ collections, count: collections.length }));
};

export const getCollectionByHandle = async function (handle: string): Promise<HttpTypes.StoreCollection> {
  return sdk.store.collection
    .list({ handle })
    .then(({ collections }) => collections[0])
    .catch(medusaError);
};
