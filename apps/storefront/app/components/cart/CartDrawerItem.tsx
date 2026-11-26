import { Button } from '@app/components/common/buttons/Button';
import { Image } from '@app/components/common/images/Image';
import { useI18n } from '@app/hooks/useI18n';
import { useRemoveCartItem } from '@app/hooks/useRemoveCartItem';
import { QuantitySelector } from '@app/components/common/remix-hook-form/field-groups/QuantitySelector';
import { isGiftItem } from '@libs/util/gifts';
import { formatLineItemPrice } from '@libs/util/prices';
import { StoreCartLineItem } from '@medusajs/types';
import clsx from 'clsx';
import type { FC } from 'react';
import { FetcherKeys } from '@libs/util/fetcher-keys';
import { useFetcher } from 'react-router';
import { GiftBadge } from './GiftBadge';
import { LineItemQuantitySelect } from './line-items/LineItemQuantitySelect';
export interface CartDrawerItemProps {
  item: StoreCartLineItem;
  currencyCode: string;
  isRemoving?: boolean;
}

export const CartDrawerItem: FC<CartDrawerItemProps> = ({ item, currencyCode, isRemoving }) => {
  const removeCartItem = useRemoveCartItem();
  const { t } = useI18n();
  // The gift is managed by the backend: it cannot be removed or resized here
  const isGift = isGiftItem(item);
  const isFreeGift = isGift && Number(item.total) === 0;
  const handleRemoveFromCart = () => removeCartItem.submit(item);
  const fetcher = useFetcher({ key: FetcherKeys.cart.updateLineItem });

  const handleChange = (quantity: number) => {
    fetcher.submit(
      {
        lineItemId: item.id,
        quantity: quantity,
      },
      { method: 'post', action: '/api/cart/line-items/update' },
    );
  };

  const thumbnailSrc =
    item.thumbnail ||
    (item.variant as any)?.thumbnail ||
    item.variant?.product?.thumbnail ||
    (item.variant?.product as any)?.images?.[0]?.url ||
    '';

  return (
    <li
      key={item.id}
      className={clsx('flex h-36 py-6 opacity-100 transition-all', {
        '!h-0 !p-0 !opacity-0': isRemoving,
      })}
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={thumbnailSrc}
          alt={item.product_title || 'product thumbnail'}
          maxWidth={400}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">{item.product_title}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{item.variant_title}</p>
              {isGift && <GiftBadge />}
            </div>
            {!isGift && (
              <Button variant="link" onClick={handleRemoveFromCart} disabled={isRemoving} className="text-sm">
                {isRemoving ? 'Removing' : 'Remove'}
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between">
          <p className="text-sm  text-gray-500">
            {isGift ? `x${item.quantity}` : <LineItemQuantitySelect formId={`quantity-${item.id}`} item={item} />}
          </p>
          <div className="flex">
            <p className="ml-4">{isFreeGift ? t('cart.gift.free') : formatLineItemPrice(item, currencyCode)}</p>
          </div>
        </div>
      </div>
    </li>
  );
};
