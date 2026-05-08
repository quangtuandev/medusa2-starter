import cachified from '@epic-web/cachified';
import { sdk, sdkCache } from '@libs/util/server/client.server';
import { MILLIS } from '../cache-builder.server';

export interface FeatureFlags {
  customer_reviews: boolean;
}

const defaultFeatureFlags: FeatureFlags = {
  customer_reviews: true,
};

export const fetchFeatureFlags = async (): Promise<FeatureFlags> => {
  return await cachified({
    key: 'store-feature-flags',
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS * 6, // Cache for 1 minute
    async getFreshValue() {
      try {
        const response = await sdk.client.fetch<{ feature_flags: FeatureFlags }>(`/store/feature-flags`, {
          method: 'GET',
        });
        return response.feature_flags;
      } catch (error) {
        console.error('Failed to fetch feature flags, using defaults:', error);
        return defaultFeatureFlags;
      }
    },
  });
};
