import { useI18n } from '@app/hooks/useI18n';
import { calculateEstimatedShipping } from '@libs/util/carts';
import { getGiftTotals } from '@libs/util/gifts';
import { formatPrice } from '@libs/util/prices';
import { PromotionDTO, StoreCart, StoreCartShippingOption, StoreRegion } from '@medusajs/types';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { CheckoutOrderSummaryDiscountCode } from './CheckoutOrderSummaryDiscountCode';

export interface CheckoutOrderSummaryTotalsProps extends HTMLAttributes<HTMLDListElement> {
  cart: StoreCart & { promotions: PromotionDTO[] };
  shippingOptions: StoreCartShippingOption[];
}

export interface CheckoutOrderSummaryTotalsItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  amount?: number | null;
  region: StoreRegion;
}

const CheckoutOrderSummaryTotalsItem: FC<CheckoutOrderSummaryTotalsItemProps> = ({
  label,
  amount,
  className,
  region,
}) => (
  <div className={clsx('flex items-center justify-between text-sm', className)}>
    <dt>{label}</dt>
    <dd className="font-bold text-gray-900">{formatPrice(amount || 0, { currency: region?.currency_code })}</dd>
  </div>
);

export const CheckoutOrderSummaryTotals: FC<CheckoutOrderSummaryTotalsProps> = ({ shippingOptions, cart }) => {
  const { t } = useI18n();
  const shippingMethods = cart.shipping_methods || [];
  const hasShippingMethod = shippingMethods.length > 0;
  const estimatedShipping = calculateEstimatedShipping(shippingOptions);
  // The free gift is listed as a free item, so its price and its discount are left out of both lines
  const giftTotals = getGiftTotals(cart.items);
  const subtotal = (cart.item_subtotal ?? 0) - giftTotals.subtotal;
  const discountTotal = (cart.discount_total ?? 0) - giftTotals.discount;
  const shippingAmount = cart.shipping_total ?? 0;
  const cartTotal = cart.total ?? 0;
  const total = hasShippingMethod ? cartTotal : cartTotal + estimatedShipping;

  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      <CheckoutOrderSummaryDiscountCode cart={cart} />

      <dl className="flex flex-col gap-2">
        <CheckoutOrderSummaryTotalsItem label={t('common.subtotal')} amount={subtotal} region={cart.region!} />
        {discountTotal > 0 && (
          <CheckoutOrderSummaryTotalsItem label={t('common.discount')} amount={-discountTotal} region={cart.region!} />
        )}
        {hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label={t('common.shipping')} amount={shippingAmount} region={cart.region!} />
        )}
        {!hasShippingMethod && (
          <CheckoutOrderSummaryTotalsItem label={t('checkout.estimatedShipping')} amount={estimatedShipping} region={cart.region!} />
        )}
        <CheckoutOrderSummaryTotalsItem label={t('common.tax')} amount={cart.tax_total} region={cart.region!} />
        <CheckoutOrderSummaryTotalsItem
          label={t('common.total')}
          amount={total}
          className="border-t border-gray-200 pt-6 !text-xl"
          region={cart.region!}
        />
      </dl>
    </div>
  );
};
