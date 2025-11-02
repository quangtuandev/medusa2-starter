"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeProductReviewRoutesMiddlewares = exports.defaultStoreReviewsQueryConfig = exports.allowedStoreProductReviewFields = exports.defaultStoreProductReviewFields = exports.upsertProductReviewsSchema = exports.listStoreProductReviewsQuerySchema = void 0;
const framework_1 = require("@medusajs/framework");
const validators_1 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
const reviewStatuses = zod_1.z.enum(['pending', 'approved', 'flagged']);
exports.listStoreProductReviewsQuerySchema = (0, validators_1.createFindParams)({
    offset: 0,
    limit: 50,
}).merge(zod_1.z.object({
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    status: zod_1.z.union([reviewStatuses, zod_1.z.array(reviewStatuses)]).default('approved').optional(),
    product_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    order_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    rating: zod_1.z.union([zod_1.z.number().max(5).min(1), zod_1.z.array(zod_1.z.number().max(5).min(1))]).optional(),
    created_at: (0, validators_1.createOperatorMap)().optional(),
    updated_at: (0, validators_1.createOperatorMap)().optional(),
}));
exports.upsertProductReviewsSchema = zod_1.z.object({
    reviews: zod_1.z.array(zod_1.z.object({
        order_id: zod_1.z.string(),
        order_line_item_id: zod_1.z.string(),
        rating: zod_1.z.number().max(5).min(1),
        content: zod_1.z.string(),
        images: zod_1.z.array(zod_1.z.object({ url: zod_1.z.string() })),
    })),
});
exports.defaultStoreProductReviewFields = [
    'id',
    'status',
    'product_id',
    'name',
    'rating',
    'content',
    'created_at',
    'updated_at',
    'response.*',
    'images.*'
];
exports.allowedStoreProductReviewFields = [
    'id',
    'status',
    'product_id',
    'name',
    'rating',
    'content',
    'created_at',
    'updated_at',
    'response',
    'images'
];
exports.defaultStoreReviewsQueryConfig = {
    allowed: [...exports.allowedStoreProductReviewFields],
    defaults: [...exports.defaultStoreProductReviewFields],
    defaultLimit: 50,
    isList: true,
};
exports.storeProductReviewRoutesMiddlewares = [
    {
        matcher: '/store/product-reviews',
        method: 'GET',
        middlewares: [(0, framework_1.validateAndTransformQuery)(exports.listStoreProductReviewsQuerySchema, exports.defaultStoreReviewsQueryConfig)],
    },
    {
        matcher: '/store/product-reviews',
        method: 'POST',
        middlewares: [(0, framework_1.validateAndTransformBody)(exports.upsertProductReviewsSchema)],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3QtcmV2aWV3cy9taWRkbGV3YXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBZ0g7QUFDaEgsc0VBQTRGO0FBQzVGLDZCQUF3QjtBQUl4QixNQUFNLGNBQWMsR0FBRyxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBRXBELFFBQUEsa0NBQWtDLEdBQUcsSUFBQSw2QkFBZ0IsRUFBQztJQUNqRSxNQUFNLEVBQUUsQ0FBQztJQUNULEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FDTixPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1AsRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ3pELE1BQU0sRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDekYsVUFBVSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ2pFLFFBQVEsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxD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