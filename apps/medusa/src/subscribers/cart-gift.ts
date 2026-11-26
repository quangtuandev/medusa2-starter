import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import {
  addToCartWorkflow,
  deleteLineItemsWorkflow,
  updateLineItemInCartWorkflow,
} from '@medusajs/medusa/core-flows';
import { getGiftConfig } from '../workflows/hooks/gift-config';
import { GIFT_ITEM_METADATA_KEY, GiftConfig, decideGiftAction } from '../workflows/hooks/gift-promotion';

type Container = SubscriberArgs<unknown>['container'];

const getGiftVariantId = async (container: Container, productId: string) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'product',
    fields: ['id', 'variants.id', 'variants.variant_rank'],
    filters: { id: productId },
  });
  const variants = [...(data[0]?.variants ?? [])].sort((a, b) => (a?.variant_rank ?? 0) - (b?.variant_rank ?? 0));
  return variants[0]?.id as string | undefined;
};

/** Makes the cart hold exactly one gift line when it qualifies and none otherwise. Safe to run repeatedly. */
const syncGift = async (container: Container, cartId: string, config: GiftConfig | null) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'cart',
    fields: [
      'id',
      'currency_code',
      'completed_at',
      'items.id',
      'items.quantity',
      'items.unit_price',
      'items.product_id',
      'items.metadata',
    ],
    filters: { id: cartId },
  });

  const cart = data[0];
  if (!cart || cart.completed_at) return;

  const plan = decideGiftAction(cart, config);

  if (plan.removeItemIds.length) {
    await deleteLineItemsWorkflow(container).run({ input: { cart_id: cartId, ids: plan.removeItemIds } });
  }

  if (plan.resetQuantityItemId) {
    await updateLineItemInCartWorkflow(container).run({
      input: { cart_id: cartId, item_id: plan.resetQuantityItemId, update: { quantity: 1 } },
    });
  }

  if (plan.add && config) {
    const variantId = await getGiftVariantId(container, config.productIds[0]);
    if (!variantId) {
      container.resolve(ContainerRegistrationKeys.LOGGER).warn(`[Gift] Product ${config.productIds[0]} has no variant`);
      return;
    }

    // Added at its real price: the gift promotion discounts it to 0.
    await addToCartWorkflow(container).run({
      input: { cart_id: cartId, items: [{ variant_id: variantId, quantity: 1, metadata: { [GIFT_ITEM_METADATA_KEY]: true } }] },
    });
  }
};

export default async function cartGiftHandler({ event: { data }, container }: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    // With no gift promotion this still runs, to remove gift lines left in carts that nothing discounts any more.
    const config = await getGiftConfig(container);

    // Adding or removing the gift emits `cart.updated` again, so runs for the same cart must not overlap.
    // The key is not the cart id: core cart workflows already lock on that.
    await container
      .resolve(Modules.LOCKING)
      .execute(`gift-sync:${data.id}`, () => syncGift(container, data.id, config), { timeout: 10 });
  } catch (error) {
    // A missed add is harmless and a missed remove is caught when the cart is completed.
    logger.error(`[Gift] Could not sync the gift for cart ${data.id}: ${error}`);
  }
}

export const config: SubscriberConfig = {
  event: ['cart.created', 'cart.updated'],
};
