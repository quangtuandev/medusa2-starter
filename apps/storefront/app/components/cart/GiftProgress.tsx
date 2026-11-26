import { useCart } from '@app/hooks/useCart';
import { useGift } from '@app/hooks/useGift';
import { useI18n } from '@app/hooks/useI18n';
import { getGiftEligibleValue, isGiftEligibleCart } from '@libs/util/gifts';
import { formatPrice } from '@libs/util/prices';
import type { FC } from 'react';

/** How far the cart is from the free gift, or a note once it qualifies. The gift itself is added by the backend. */
export const GiftProgress: FC = () => {
  const { t } = useI18n();
  const { cart } = useCart();
  const { gift, isGiftItem } = useGift();

  const items = cart?.items ?? [];
  const currency = (cart?.currency_code ?? '').toLowerCase();
  if (!gift || !items.length || (gift.currencies.length && !gift.currencies.includes(currency))) return null;

  if (isGiftEligibleCart({ currency_code: currency, items }, gift)) {
    return items.some((item) => isGiftItem(item)) ? (
      <p className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        {t('cart.gift.unlocked')}
      </p>
    ) : null;
  }

  const value = getGiftEligibleValue(items, gift.productIds);
  const remaining = Math.max(gift.threshold - value, 0);
  const progress = Math.min(100, Math.round((value / gift.threshold) * 100));

  return (
    <div className="mt-6 rounded-md bg-gray-50 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900">
        {t('cart.gift.progress', { amount: formatPrice(remaining, { currency }) })}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
