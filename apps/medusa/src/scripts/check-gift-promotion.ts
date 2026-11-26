import type { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { GIFT_PROMOTION_FIELDS, GIFT_PROMOTION_FILTERS, getGiftConfig } from '../workflows/hooks/gift-config';

/**
 * Prints what the free-gift code sees: the raw promotions it queries and the configuration parsed from them.
 * Run: yarn medusa exec ./src/scripts/check-gift-promotion.ts
 */
export default async function checkGiftPromotion({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: 'promotion',
    fields: ['code', ...GIFT_PROMOTION_FIELDS],
    filters: GIFT_PROMOTION_FILTERS,
  });

  console.log('Active automatic promotions (raw):');
  console.log(JSON.stringify(data, null, 2));
  console.log('Parsed gift configuration (null means the code will do nothing):');
  console.log(JSON.stringify(await getGiftConfig(container), null, 2));
}
