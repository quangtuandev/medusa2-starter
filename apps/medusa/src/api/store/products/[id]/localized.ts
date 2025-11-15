import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { CONTENTFUL_MODULE } from '../../../../modules/contentful';

/**
 * GET /store/products/:id/localized
 *
 * Fetch localized product data from Contentful
 * Query params:
 *   - locale: Locale code (default: en-US)
 *
 * Example: GET /store/products/prod_123/localized?locale=vi
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const locale = (req.query.locale as string) || 'en-US';

  try {
    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;

    // Get localized product data from Contentful
    const localizedProduct = await contentfulService.getLocalizedProduct(id, locale);

    if (!localizedProduct) {
      return res.status(404).json({
        error: 'Product not found in Contentful',
        product_id: id,
        locale,
      });
    }

    // Get localized variants
    const localizedVariants = await contentfulService.getLocalizedVariants(id, locale);

    return res.json({
      product_id: id,
      locale,
      product: localizedProduct,
      variants: localizedVariants,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      error: message,
      product_id: id,
      locale,
    });
  }
};
