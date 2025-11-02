"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductReviewStatRoutesMiddlewares = exports.defaultProductReviewStatsQueryConfig = exports.defaultAdminProductReviewStatFields = exports.listAdminProductReviewStatsQuerySchema = void 0;
const framework_1 = require("@medusajs/framework");
const validators_1 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
const listAdminProductReviewStatsQuerySchema = (0, validators_1.createFindParams)({
    offset: 0,
    limit: 50,
}).merge(zod_1.z.object({
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    product_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    average_rating: zod_1.z.union([zod_1.z.number().max(5).min(1), zod_1.z.array(zod_1.z.number().max(5).min(1))]).optional(),
    created_at: (0, validators_1.createOperatorMap)().optional(),
    updated_at: (0, validators_1.createOperatorMap)().optional(),
}));
exports.listAdminProductReviewStatsQuerySchema = listAdminProductReviewStatsQuerySchema;
exports.defaultAdminProductReviewStatFields = [
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
exports.defaultProductReviewStatsQueryConfig = {
    defaults: [...exports.defaultAdminProductReviewStatFields],
    defaultLimit: 50,
    isList: true,
};
exports.adminProductReviewStatRoutesMiddlewares = [
    {
        matcher: '/admin/product-review-stats',
        method: 'GET',
        middlewares: [
            (0, framework_1.validateAndTransformQuery)(listAdminProductReviewStatsQuerySchema, exports.defaultProductReviewStatsQueryConfig),
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3LXN0YXRzL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFzRjtBQUN0RixzRUFBNEY7QUFDNUYsNkJBQXdCO0FBRXhCLE1BQU0sc0NBQXNDLEdBQUcsSUFBQSw2QkFBZ0IsRUFBQztJQUM5RCxNQUFNLEVBQUUsQ0FBQztJQUNULEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FDTixPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1AsRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ3pELFVBQVUsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtJQUNqRSxjQUFjLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ2pHLFVBQVUsRUFBRSxJQUFBLDhCQUFpQixHQUFFLENBQUMsUUFBUSxFQUFFO0lBQzFDLFVBQVUsRUFBRSxJQUFBLDhCQUFpQixHQUFFLENBQUMsUUFBUSxFQUFFO0NBQzNDLENBQUMsQ0FDSCxDQUFDO0FBQ08sd0ZBQXNDO0FBSWxDLFFBQUEsbUNBQW1DLEdBQUc7SUFDakQsSUFBSTtJQUNKLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsY0FBYztJQUNkLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLFlBQVk7Q0FDYixDQUFDO0FBRVcsUUFBQSxvQ0FBb0MsR0FBRztJQUNsRCxRQUFRLEVBQUUsQ0FBQyxHQUFHLDJDQUFtQyxDQUFDO0lBQ2xELFlBQVksRUFBRSxFQUFFO0lBQ2hCLE1BQU0sRUFBRSxJQUFJO0NBQ2IsQ0FBQztBQUVXLFFBQUEsdUNBQXVDLEdBQXNCO0lBQ3hFO1FBQ0UsT0FBTyxFQUFFLDZCQUE2QjtRQUN0QyxNQUFNLEVBQUUsS0FBSztRQUNiLFdBQVcsRUFBRTtZQUNYLElBQUEscUNBQXlCLEVBQUMsc0NBQXNDLEVBQUUsNENBQW9DLENBQUM7U0FDeEc7S0FDRjtDQUNGLENBQUMifQ==