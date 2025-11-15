import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { CONTENTFUL_MODULE } from '../../../modules/contentful';
import { syncProductToContentfulWorkflow } from '../../../workflows/sync-product-to-contentful';
import { z } from 'zod';

const SyncProductSchema = z.object({
  product_id: z.string().min(1),
  locales: z.record(
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
  ).optional(),
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
 *       "description": "Product Description"
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
      input: body,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(400).json({
      error: message,
    });
  }
};

/**
 * GET /admin/contentful/sync/products
 *
 * List all products that can be synced to Contentful
 * Query params:
 *   - limit: Number of products to return (default: 20)
 *   - offset: Pagination offset (default: 0)
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const productModule = req.scope.resolve(Modules.PRODUCT) as any;

    const products = await productModule.listProducts(
      {},
      {
        select: ['id', 'title', 'handle', 'status'],
        take: limit,
        skip: offset,
      }
    );

    return res.json({
      products,
      pagination: {
        total: products.length,
        limit,
        offset,
        hasMore: products.length >= limit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return res.status(500).json({
      error: message,
    });
  }
};
