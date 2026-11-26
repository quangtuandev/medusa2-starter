import cachified from '@epic-web/cachified';
import { sdkCache } from './client.server';
import { config } from './config.server';
import type { GiftConfig } from '../gifts';

/** The gift promotion is read from the backend; it changes rarely, so a short cache is enough. */
export const fetchGiftConfig = async (): Promise<GiftConfig | null> =>
  cachified({
    key: 'gift-config',
    cache: sdkCache,
    ttl: 30_000,
    staleWhileRevalidate: 300_000,
    async getFreshValue() {
      const baseUrl = config.INTERNAL_MEDUSA_API_URL || config.PUBLIC_MEDUSA_API_URL || 'http://localhost:7901';

      try {
        const res = await fetch(`${baseUrl}/store/gift`, {
          headers: { 'x-publishable-api-key': config.MEDUSA_PUBLISHABLE_KEY || '' },
        });
        if (!res.ok) {
          console.error(`Failed to fetch the gift configuration: ${res.status} ${baseUrl}/store/gift`);
          return null;
        }

        const { gift } = await res.json();
        return gift
          ? {
              productIds: gift.product_ids ?? [],
              threshold: Number(gift.threshold),
              inclusive: gift.inclusive !== false,
              currencies: gift.currencies ?? [],
            }
          : null;
      } catch (error) {
        // Without a configuration nothing is hidden and no gift UI is shown; the cart itself keeps working.
        console.error('Failed to fetch the gift configuration:', error);
        return null;
      }
    },
  });
