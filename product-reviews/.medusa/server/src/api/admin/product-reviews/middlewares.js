"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductReviewRoutesMiddlewares = exports.defaultProductReviewsQueryConfig = exports.defaultAdminProductReviewFields = exports.listAdminProductReviewsQuerySchema = void 0;
const framework_1 = require("@medusajs/framework");
const validators_1 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
const statuses = zod_1.z.enum(['pending', 'approved', 'rejected']);
exports.listAdminProductReviewsQuerySchema = (0, validators_1.createFindParams)({
    offset: 0,
    limit: 50,
}).merge(zod_1.z.object({
    q: zod_1.z.string().optional(),
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    status: zod_1.z.union([statuses, zod_1.z.array(statuses)]).optional(),
    product_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    order_id: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    rating: zod_1.z.union([zod_1.z.number().max(5).min(1), zod_1.z.array(zod_1.z.number().max(5).min(1))]).optional(),
    created_at: (0, validators_1.createOperatorMap)().optional(),
    updated_at: (0, validators_1.createOperatorMap)().optional(),
}));
exports.defaultAdminProductReviewFields = [
    'id',
    'status',
    'product_id',
    'rating',
    'name',
    'email',
    'content',
    'order_id',
    'created_at',
    'updated_at',
    'response.*',
    'images.*',
    'product.*',
    'order.*',
];
exports.defaultProductReviewsQueryConfig = {
    defaults: [...exports.defaultAdminProductReviewFields],
    defaultLimit: 50,
    isList: true,
};
exports.adminProductReviewRoutesMiddlewares = [
    {
        matcher: '/admin/product-reviews',
        method: 'GET',
        middlewares: [(0, framework_1.validateAndTransformQuery)(exports.listAdminProductReviewsQuerySchema, exports.defaultProductReviewsQueryConfig)],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3cy9taWRkbGV3YXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBc0Y7QUFDdEYsc0VBQTRGO0FBQzVGLDZCQUF3QjtBQUV4QixNQUFNLFFBQVEsR0FBRyxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQVUsQ0FBQyxDQUFDO0FBQ3pELFFBQUEsa0NBQWtDLEdBQUcsSUFBQSw2QkFBZ0IsRUFBQztJQUNqRSxNQUFNLEVBQUUsQ0FBQztJQUNULEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQyxDQUFDLEtBQUssQ0FDTixPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1AsQ0FBQyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ3pELE1BQU0sRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtJQUN6RCxVQUFVLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDakUsUUFBUSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQy9ELE1BQU0sRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDekYsVUFBVSxFQUFFLElBQUEsOEJBQWlCLEdBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDMUMsVUFBVSxFQUFFLElBQUEsOEJBQWlCLEdBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDM0MsQ0FBQyxDQUNILENBQUM7QUFFVyxRQUFBLCtCQUErQixHQUFHO0lBQzdDLElBQUk7SUFDSixRQUFRO0lBQ1IsWUFBWTtJQUNaLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLFNBQVM7SUFDVCxVQUFVO0lBQ1YsWUFBWTtJQUNaLFlBQVk7SUFDWixZQUFZO0lBQ1osVUFBVTtJQUNWLFdBQVc7SUFDWCxTQUFTO0NBQ1YsQ0FBQztBQUVXLFFBQUEsZ0NBQWdDLEdBQUc7SUFDOUMsUUFBUSxFQUFFLENBQUMsR0FBRyx1Q0FBK0IsQ0FBQztJQUM5QyxZQUFZLEVBQUUsRUFBRTtJQUNoQixNQUFNLEVBQUUsSUFBSTtDQUNiLENBQUM7QUFFVyxRQUFBLG1DQUFtQyxHQUFzQjtJQUNwRTtRQUNFLE9BQU8sRUFBRSx3QkFBd0I7UUFDakMsTUFBTSxFQUFFLEtBQUs7UUFDYixXQUFXLEVBQUUsQ0FBQyxJQUFBLHFDQUF5QixFQUFDLDBDQUFrQyxFQUFFLHdDQUFnQyxDQUFDLENBQUM7S0FDL0c7Q0FDRixDQUFDIn0=