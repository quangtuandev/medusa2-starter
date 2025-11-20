import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { CONTENTFUL_MODULE } from '../../../../../modules/contentful';
import { Modules } from '@medusajs/framework/utils';

/**
 * GET /store/contentful/products/:id/localized
 *
 * Fetch localized product data from Contentful
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
    const productModule = req.scope.resolve(Modules.PRODUCT) as any;

    if (!contentfulService) {
      return res.status(503).json({
        error: 'Contentful service not available',
      });
    }

    // Get product from Medusa
    const product = await productModule.retrieveProduct(id, {
      select: ['id', 'title', 'description', 'handle'],
    }).catch(() => null);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    // Get localized data from Contentful
    const localizedData = await contentfulService.getLocalizedProduct(id, locale);

    return res.json({
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
      },
      contentful: localizedData || {
        title: product.title,
        description: product.description,
      },
      locale,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      error: message,
    });
  }
};
