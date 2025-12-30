import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { Location } from '@libs/types';
import { MILLIS } from '../cache-builder.server';

export interface LocationListResponse {
  locations: Location[];
  limit: number;
  offset: number;
  count: number;
}

export const listLocations = async (
  cacheOptions: { forceFresh?: boolean } = {},
): Promise<LocationListResponse> => {
  return await cachified({
    key: `locations`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    forceFresh: cacheOptions.forceFresh,
    async getFreshValue() {
      return await sdk.client.fetch(`/store/locations`, {
        method: 'GET',
      });
    },
  });
};