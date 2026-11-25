import { StepResponse } from '@medusajs/framework/workflows-sdk';
import { updateCartPromotionsWorkflow } from '@medusajs/medusa/core-flows';
import { buildPromotionContext } from './promotion-context';

// The returned object is merged into the cart context before promotion rules are evaluated,
// so promotions can use these attributes in `rules` (created via the Admin API).
updateCartPromotionsWorkflow.hooks.setPromotionContext(async ({ cart }) => {
  return new StepResponse(buildPromotionContext(cart));
});
