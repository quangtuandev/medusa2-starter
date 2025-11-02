"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductReviewStatusRoutesMiddlewares = exports.updateProductReviewStatusSchema = void 0;
const framework_1 = require("@medusajs/framework");
const zod_1 = require("zod");
exports.updateProductReviewStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'flagged']),
});
exports.adminProductReviewStatusRoutesMiddlewares = [
    {
        matcher: '/admin/product-reviews/:id/status',
        method: 'PUT',
        middlewares: [(0, framework_1.validateAndTransformBody)(exports.updateProductReviewStatusSchema)],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3cy9baWRdL3N0YXR1cy9taWRkbGV3YXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBcUY7QUFDckYsNkJBQXdCO0FBRVgsUUFBQSwrQkFBK0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RELE1BQU0sRUFBRSxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztDQUNuRCxDQUFDLENBQUM7QUFJVSxRQUFBLHlDQUF5QyxHQUFzQjtJQUMxRTtRQUNFLE9BQU8sRUFBRSxtQ0FBbUM7UUFDNUMsTUFBTSxFQUFFLEtBQUs7UUFDYixXQUFXLEVBQUUsQ0FBQyxJQUFBLG9DQUF3QixFQUFDLHVDQUErQixDQUFDLENBQUM7S0FDekU7Q0FDRixDQUFDIn0=