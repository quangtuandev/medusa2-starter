import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { CONTENTFUL_MODULE } from '../../../../../../modules/contentful';

/**
 * GET /store/contentful/products/:id/variants
 *
 * Fetch localized variants for a product from Contentful
 * Query params:
 *   - locale: Contentful locale code (default: en-US)
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params;
    const locale = (req.query.locale as string) || 'en-US';

    if (!id) {
      return res.status(400).json({
        error: 'Product ID is required',
      });
    }

    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService) {
      return res.status(503).json({
        error: 'Contentful service not available',
      });
    }

    // Get localized variants from Contentful
    const variants = await contentfulService.getLocalizedVariants(id, locale);

    return res.json({
      product_id: id,
      locale,
      variants,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      error: message,
    });
  }
};
