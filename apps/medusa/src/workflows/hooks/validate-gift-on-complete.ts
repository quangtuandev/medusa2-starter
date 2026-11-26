import { MedusaError } from '@medusajs/framework/utils';
import { completeCartWorkflow } from '@medusajs/medusa/core-flows';
import { getGiftConfigState } from './gift-config';
import { hasIneligibleGift } from './gift-promotion';

// Last line of defence: the cart subscriber removes a gift when a cart stops qualifying (or when the promotion
// ends), but if that was missed the gift would be sold at full price, so the order is refused instead.
// If the promotion cannot be read at all, checkout fails open rather than being blocked by our own error.
completeCartWorkflow.hooks.validate(async ({ cart }, { container }) => {
  const { ok, config } = await getGiftConfigState(container);
  if (ok && hasIneligibleGift(cart, config)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      'The free gift in this cart no longer qualifies. Please refresh your cart and try again.',
    );
  }
});
