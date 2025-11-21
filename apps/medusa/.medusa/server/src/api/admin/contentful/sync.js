"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.GET_STATUS = exports.POST_BULK = exports.GET = exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const contentful_1 = require("../../../modules/contentful");
const sync_product_to_contentful_1 = require("../../../workflows/sync-product-to-contentful");
const zod_1 = require("zod");
const SyncProductSchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1, 'Product ID is required'),
    locales: zod_1.z
        .record(zod_1.z.string(), zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().optional(),
        seoTitle: zod_1.z.string().optional(),
        seoDescription: zod_1.z.string().optional(),
    }))
        .optional(),
});
const SyncBulkProductsSchema = zod_1.z.object({
    product_ids: zod_1.z.array(zod_1.z.string().min(1)),
    locales: zod_1.z
        .record(zod_1.z.string(), zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        seoTitle: zod_1.z.string().optional(),
        seoDescription: zod_1.z.string().optional(),
    }))
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
const POST = async (req, res) => {
    try {
        const body = SyncProductSchema.parse(req.body);
        const workflow = (0, sync_product_to_contentful_1.syncProductToContentfulWorkflow)(req.scope);
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(400).json({
            success: false,
            error: message,
        });
    }
};
exports.POST = POST;
/**
 * GET /admin/contentful/sync/products
 *
 * List all products that can be synced to Contentful with pagination
 * Query params:
 *   - limit: Number of products to return (default: 20, max: 100)
 *   - offset: Pagination offset (default: 0)
 *   - q: Search query for product title/handle
 */
const GET = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        const query = req.query.q || '';
        const productModule = req.scope.resolve(utils_1.Modules.PRODUCT);
        // Build filter for search
        const filters = {};
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            success: false,
            error: message,
        });
    }
};
exports.GET = GET;
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
const POST_BULK = async (req, res) => {
    try {
        const body = SyncBulkProductsSchema.parse(req.body);
        const results = [];
        const errors = [];
        for (const productId of body.product_ids) {
            try {
                const workflow = (0, sync_product_to_contentful_1.syncProductToContentfulWorkflow)(req.scope);
                const result = await workflow.run({
                    input: {
                        product_id: productId,
                        locales: body.locales,
                    },
                });
                results.push({
                    product_id: productId,
                    success: true,
                    data: result,
                });
            }
            catch (error) {
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(400).json({
            success: false,
            error: message,
        });
    }
};
exports.POST_BULK = POST_BULK;
/**
 * GET /admin/contentful/sync/status/:productId
 *
 * Get sync status of a product in Contentful
 */
const GET_STATUS = async (req, res) => {
    try {
        const { productId } = req.params;
        const contentfulService = req.scope.resolve(contentful_1.CONTENTFUL_MODULE);
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            success: false,
            error: message,
        });
    }
};
exports.GET_STATUS = GET_STATUS;
/**
 * DELETE /admin/contentful/sync/:productId
 *
 * Remove a product from Contentful
 */
const DELETE = async (req, res) => {
    try {
        const { productId } = req.params;
        const contentfulService = req.scope.resolve(contentful_1.CONTENTFUL_MODULE);
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        return res.status(500).json({
            success: false,
            error: message,
        });
    }
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvYWRtaW4vY29udGVudGZ1bC9zeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUFvRDtBQUNwRCw0REFBZ0U7QUFDaEUsOEZBQWdHO0FBQ2hHLDZCQUF3QjtBQUV4QixNQUFNLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDakMsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLHdCQUF3QixDQUFDO0lBQ3ZELE9BQU8sRUFBRSxPQUFDO1NBQ1AsTUFBTSxDQUNMLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFDVixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDO1FBQzdDLFdBQVcsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2xDLFFBQVEsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQy9CLGNBQWMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0tBQ3RDLENBQUMsQ0FDSDtTQUNBLFFBQVEsRUFBRTtDQUNkLENBQUMsQ0FBQztBQUVILE1BQU0sc0JBQXNCLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxXQUFXLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sRUFBRSxPQUFDO1NBQ1AsTUFBTSxDQUNMLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFDVixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDNUIsV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDbEMsUUFBUSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDL0IsY0FBYyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7S0FDdEMsQ0FBQyxDQUNIO1NBQ0EsUUFBUSxFQUFFO0NBQ2QsQ0FBQyxDQUFDO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNJLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBa0IsRUFDbEIsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0MsTUFBTSxRQUFRLEdBQUcsSUFBQSw0REFBK0IsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ2hDLEtBQUssRUFBRTtnQkFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsV0FBVyxJQUFJLENBQUMsVUFBVSxvQ0FBb0M7U0FDeEUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBM0JXLFFBQUEsSUFBSSxRQTJCZjtBQUVGOzs7Ozs7OztHQVFHO0FBQ0ksTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUN0QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxNQUFNLEtBQUssR0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQVksSUFBSSxFQUFFLENBQUM7UUFFNUMsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBUSxDQUFDO1FBRWhFLDBCQUEwQjtRQUMxQixNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDeEIsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLE9BQU8sQ0FBQyxHQUFHLEdBQUc7Z0JBQ1osRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDM0MsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRTthQUM3QyxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDO2dCQUN6RCxJQUFJLEVBQUUsS0FBSztnQkFDWCxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO2FBQzlCLENBQUM7WUFDRixhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztTQUNwQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDZCxRQUFRO1lBQ1IsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTTtnQkFDcEMsS0FBSztnQkFDTCxNQUFNO2dCQUNOLE9BQU8sRUFBRSxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBOUNXLFFBQUEsR0FBRyxPQThDZDtBQUVGOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSSxNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQzVCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFbEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDO2dCQUNILE1BQU0sUUFBUSxHQUFHLElBQUEsNERBQStCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQ2hDLEtBQUssRUFBRTt3QkFDTCxVQUFVLEVBQUUsU0FBUzt3QkFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUEwQztxQkFDekQ7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ1gsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLE9BQU8sRUFBRSxJQUFJO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ1YsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlO2lCQUNoRSxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDNUIsT0FBTztZQUNQLE1BQU07WUFDTixPQUFPLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTtnQkFDOUIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUMxQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU07YUFDdEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sT0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO1FBQzdFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsT0FBTyxFQUFFLEtBQUs7WUFDZCxLQUFLLEVBQUUsT0FBTztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUFsRFcsUUFBQSxTQUFTLGFBa0RwQjtBQUVGOzs7O0dBSUc7QUFDSSxNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQzdCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUVqQyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDhCQUFpQixDQUFRLENBQUM7UUFFdEUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDdkIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxFQUFFLGtDQUFrQzthQUMxQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDZCxVQUFVLEVBQUUsU0FBUztZQUNyQixNQUFNLEVBQUUsQ0FBQyxDQUFDLGFBQWE7WUFDdkIsSUFBSSxFQUFFLGFBQWE7U0FDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBN0JXLFFBQUEsVUFBVSxjQTZCckI7QUFFRjs7OztHQUlHO0FBQ0ksTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUN6QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFFakMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw4QkFBaUIsQ0FBUSxDQUFDO1FBRXRFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSxrQ0FBa0M7YUFDMUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0saUJBQWlCLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLFdBQVcsU0FBUywwQkFBMEI7U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUM3RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBNUJXLFFBQUEsTUFBTSxVQTRCakIifQ==