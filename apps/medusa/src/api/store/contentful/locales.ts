import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { CONTENTFUL_MODULE } from '../../../modules/contentful';

/**
 * GET /store/contentful/locales
 *
 * Fetch list of available locales from Contentful
 * This is used by the storefront to populate locale selector
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;
    const locales = await contentfulService.getAvailableLocales();

    return res.json({
      locales,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch locales';
    return res.status(500).json({
      error: message,
    });
  }
};
