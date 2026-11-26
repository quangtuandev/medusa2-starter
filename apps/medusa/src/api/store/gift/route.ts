import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { getGiftConfig } from '../../../workflows/hooks/gift-config';

/** The free-gift configuration, read from the active gift promotion; `gift` is null when there is none. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const config = await getGiftConfig(req.scope);

    res.json({
      gift: config
        ? {
            product_ids: config.productIds,
            threshold: config.threshold,
            inclusive: config.inclusive,
            currencies: config.currencies,
          }
        : null,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch the gift configuration' });
  }
};
