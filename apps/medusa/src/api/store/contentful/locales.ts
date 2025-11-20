import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { CONTENTFUL_MODULE } from '../../../modules/contentful';

/**
 * GET /store/contentful/locales
 *
 * Fetch all available locales from Contentful
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService) {
      return res.status(503).json({
        error: 'Contentful service not available',
      });
    }

    const locales = await contentfulService.getAvailableLocales();

    return res.json({
      locales,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      error: message,
    });
  }
};
