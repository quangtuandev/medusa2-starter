import { isGiftItem } from '@libs/util/gifts';
import { useRootLoaderData } from './useRootLoaderData';

/** Free-gift configuration from the root loader (null when there is no gift promotion) and gift line detection. */
export const useGift = () => ({
  gift: useRootLoaderData()?.gift ?? null,
  isGiftItem,
});
