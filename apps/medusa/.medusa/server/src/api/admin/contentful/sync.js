"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const sync_product_to_contentful_1 = require("../../../workflows/sync-product-to-contentful");
const zod_1 = require("zod");
const SyncProductSchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1),
    locales: zod_1.z.record(zod_1.z.object({
        title: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        seoTitle: zod_1.z.string().optional(),
        seoDescription: zod_1.z.string().optional(),
    })).optional(),
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
const POST = async (req, res) => {
    try {
        const body = SyncProductSchema.parse(req.body);
        const workflow = (0, sync_product_to_contentful_1.syncProductToContentfulWorkflow)(req.scope);
        const result = await workflow.run({
            input: body,
        });
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(400).json({
            error: message,
        });
    }
};
exports.POST = POST;
/**
 * GET /admin/contentful/sync/products
 *
 * List all products that can be synced to Contentful
 * Query params:
 *   - limit: Number of products to return (default: 20)
 *   - offset: Pagination offset (default: 0)
 */
const GET = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        const productModule = req.scope.resolve(utils_1.Modules.PRODUCT);
        const products = await productModule.listProducts({}, {
            select: ['id', 'title', 'handle', 'status'],
            take: limit,
            skip: offset,
        });
        return res.json({
            products,
            pagination: {
                total: products.length,
                limit,
                offset,
                hasMore: products.length >= limit,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            error: message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvYWRtaW4vY29udGVudGZ1bC9zeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFvRDtBQUVwRCw4RkFBZ0c7QUFDaEcsNkJBQXdCO0FBRXhCLE1BQU0saUJBQWlCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxVQUFVLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0IsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQ2YsT0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNQLEtBQUssRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QixXQUFXLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNsQyxRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUMvQixjQUFjLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtLQUN0QyxDQUFDLENBQ0gsQ0FBQyxRQUFRLEVBQUU7Q0FDYixDQUFDLENBQUM7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNJLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0MsTUFBTSxRQUFRLEdBQUcsSUFBQSw0REFBK0IsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ2hDLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ2QsT0FBTyxFQUFFLElBQUk7WUFDYixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxPQUFPLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUM7UUFDN0UsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsT0FBTztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUF0QlcsUUFBQSxJQUFJLFFBc0JmO0FBRUY7Ozs7Ozs7R0FPRztBQUNJLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBZSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekQsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBUSxDQUFDO1FBRWhFLE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLFlBQVksQ0FDL0MsRUFBRSxFQUNGO1lBQ0UsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQzNDLElBQUksRUFBRSxLQUFLO1lBQ1gsSUFBSSxFQUFFLE1BQU07U0FDYixDQUNGLENBQUM7UUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDZCxRQUFRO1lBQ1IsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTTtnQkFDdEIsS0FBSztnQkFDTCxNQUFNO2dCQUNOLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxJQUFJLEtBQUs7YUFDbEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sT0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO1FBQzdFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBbENXLFFBQUEsR0FBRyxPQWtDZCJ9