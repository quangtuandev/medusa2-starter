import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { CONTENTFUL_MODULE } from '../../../modules/contentful';
import { syncProductToContentfulWorkflow } from '../../../workflows/sync-product-to-contentful';
import { z } from 'zod';

const SyncProductSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  locales: z
    .record(
      z.string(),
      z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
      })
    )
    .optional(),
});

const SyncBulkProductsSchema = z.object({
  product_ids: z.array(z.string().min(1)),
  locales: z
    .record(
      z.string(),
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
      })
    )
    .optional(),
});

/**
 * POST /admin/contentful/sync
 *
 * Manually sync a product to Contentful with localizations
 *
 * Body:
 * {
 *   "product_id": "prod_123",
 *   "locales": {
 *     "en-US": {
 *       "title": "Product Title",
 *       "description": "Product Description",
 *       "seoTitle": "SEO Title",
 *       "seoDescription": "SEO Description"
 *     },
 *     "vi": {
 *       "title": "Tên Sản Phẩm",
 *       "description": "Mô tả Sản Phẩm"
 *     }
 *   }
 * }
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const body = SyncProductSchema.parse(req.body);

    const workflow = syncProductToContentfulWorkflow(req.scope);
    const result = await workflow.run({
      input: {
        product_id: body.product_id,
        locales: body.locales,
      },
    });

    return res.json({
      success: true,
      data: result,
      message: `Product ${body.product_id} synced to Contentful successfully`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
};

/**
 * GET /admin/contentful/sync/products
 *
 * List all products that can be synced to Contentful with pagination
 * Query params:
 *   - limit: Number of products to return (default: 20, max: 100)
 *   - offset: Pagination offset (default: 0)
 *   - q: Search query for product title/handle
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const query = (req.query.q as string) || '';

    const productModule = req.scope.resolve(Modules.PRODUCT) as any;

    // Build filter for search
    const filters: any = {};
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: 'i' } },
        { handle: { $regex: query, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      productModule.listProducts(filters, {
        select: ['id', 'title', 'handle', 'status', 'created_at'],
        take: limit,
        skip: offset,
        order: { created_at: 'DESC' },
      }),
      productModule.listAndCount(filters),
    ]);

    return res.json({
      products,
      pagination: {
        total: total?.[1] || products.length,
        limit,
        offset,
        hasMore: offset + limit < (total?.[1] || 0),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
};

/**
 * POST /admin/contentful/sync/bulk
 *
 * Sync multiple products to Contentful in bulk
 *
 * Body:
 * {
 *   "product_ids": ["prod_123", "prod_456"],
 *   "locales": {
 *     "en-US": { "title": "...", "description": "..." },
 *     "vi": { "title": "...", "description": "..." }
 *   }
 * }
 */
export const POST_BULK = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const body = SyncBulkProductsSchema.parse(req.body);

    const results = [];
    const errors = [];

    for (const productId of body.product_ids) {
      try {
        const workflow = syncProductToContentfulWorkflow(req.scope);
        const result = await workflow.run({
          input: {
            product_id: productId,
            locales: body.locales as Record<string, any> | undefined,
          },
        });
        results.push({
          product_id: productId,
          success: true,
          data: result,
        });
      } catch (error) {
        errors.push({
          product_id: productId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return res.json({
      success: errors.length === 0,
      results,
      errors,
      summary: {
        total: body.product_ids.length,
        successful: results.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
};

/**
 * GET /admin/contentful/sync/status/:productId
 *
 * Get sync status of a product in Contentful
 */
export const GET_STATUS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { productId } = req.params;

    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService) {
      return res.status(503).json({
        error: 'Contentful service not available',
      });
    }

    const localizedData = await contentfulService.getLocalizedProduct(productId);

    return res.json({
      product_id: productId,
      synced: !!localizedData,
      data: localizedData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
};

/**
 * DELETE /admin/contentful/sync/:productId
 *
 * Remove a product from Contentful
 */
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { productId } = req.params;

    const contentfulService = req.scope.resolve(CONTENTFUL_MODULE) as any;

    if (!contentfulService) {
      return res.status(503).json({
        error: 'Contentful service not available',
      });
    }

    await contentfulService.deleteProduct(productId);

    return res.json({
      success: true,
      message: `Product ${productId} removed from Contentful`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
};
