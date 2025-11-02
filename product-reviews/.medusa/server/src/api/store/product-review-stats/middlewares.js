"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeProductReviewStatRoutesMiddlewares = exports.defaultStoreProductReviewStatsQueryConfig = exports.defaultStoreProductReviewStatFields = exports.listStoreProductReviewStatsQuerySchema = void 0;
const framework_1 = require("@medusajs/framework");
const validators_1 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
exports.listStoreProductReviewStatsQuerySchema = (0, validators_1.createFindParams)({
    offset: 0,
    limit: 50,
}).merge(zod_1.z.object({
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    product_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    average_rating: zod_1.z.union([zod_1.z.number().max(5).min(1), zod_1.z.array(zod_1.z.number().max(5).min(1))]).optional(),
    created_at: (0, validators_1.createOperatorMap)().optional(),
    updated_at: (0, validators_1.createOperatorMap)().optional(),
}));
exports.defaultStoreProductReviewStatFields = [
    'id',
    'product_id',
    'average_rating',
    'review_count',
    'rating_count_1',
    'rating_count_2',
    'rating_count_3',
    'rating_count_4',
    'rating_count_5',
    'created_at',
    'updated_at',
];
exports.defaultStoreProductReviewStatsQueryConfig = {
    defaults: [...exports.defaultStoreProductReviewStatFields],
    defaultLimit: 50,
    isList: true,
};
exports.storeProductReviewStatRoutesMiddlewares = [
    {
        matcher: '/store/product-review-stats',
        method: 'GET',
        middlewares: [
            (0, framework_1.validateAndTransformQuery)(exports.listStoreProductReviewStatsQuerySchema, exports.defaultStoreProductReviewStatsQueryConfig),
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3QtcmV2aWV3LXN0YXRzL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFzRjtBQUN0RixzRUFBNEY7QUFDNUYsNkJBQXdCO0FBRVgsUUFBQSxzQ0FBc0MsR0FBRyxJQUFBLDZCQUFnQixFQUFDO0lBQ3JFLE1BQU0sRUFBRSxDQUFDO0lBQ1QsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFDLENBQUMsS0FBSyxDQUNOLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDUCxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDekQsVUFBVSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ2pFLGNBQWMsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDakcsVUFBVSxFQUFFLElBQUEsOEJBQWlCLEdBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDMUMsVUFBVSxFQUFFLElBQUEsOEJBQWlCLEdBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDM0MsQ0FBQyxDQUNILENBQUM7QUFFVyxRQUFBLG1DQUFtQyxHQUFHO0lBQ2pELElBQUk7SUFDSixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixZQUFZO0NBQ2IsQ0FBQztBQUVXLFFBQUEseUNBQXlDLEdBQUc7SUFDdkQsUUFBUSxFQUFFLENBQUMsR0FBRywyQ0FBbUMsQ0FBQztJQUNsRCxZQUFZLEVBQUUsRUFBRTtJQUNoQixNQUFNLEVBQUUsSUFBSTtDQUNiLENBQUM7QUFFVyxRQUFBLHVDQUF1QyxHQUFzQjtJQUN4RTtRQUNFLE9BQU8sRUFBRSw2QkFBNkI7UUFDdEMsTUFBTSxFQUFFLEtBQUs7UUFDYixXQUFXLEVBQUU7WUFDWCxJQUFBLHFDQUF5QixFQUFDLDhDQUFzQyxFQUFFLGlEQUF5QyxDQUFDO1NBQzdHO0tBQ0Y7Q0FDRixDQUFDIn0=