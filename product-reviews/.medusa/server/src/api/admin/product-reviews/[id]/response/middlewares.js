"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductReviewResponseRouteMiddlewares = exports.createProductReviewResponseDTO = void 0;
const zod_1 = require("zod");
const framework_1 = require("@medusajs/framework");
exports.createProductReviewResponseDTO = zod_1.z.object({
    content: zod_1.z.string().min(1),
});
exports.adminProductReviewResponseRouteMiddlewares = [
    {
        matcher: '/admin/product-reviews/:id/response',
        method: 'POST',
        middlewares: [(0, framework_1.validateAndTransformBody)(exports.createProductReviewResponseDTO)],
    },
    {
        matcher: '/admin/product-reviews/:id/response',
        method: 'PUT',
        middlewares: [(0, framework_1.validateAndTransformBody)(exports.createProductReviewResponseDTO)],
    },
    {
        matcher: '/admin/product-reviews/:id/response',
        method: 'DELETE',
        middlewares: [],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3cy9baWRdL3Jlc3BvbnNlL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF3QjtBQUN4QixtREFBZ0Y7QUFFbkUsUUFBQSw4QkFBOEIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3JELE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUMzQixDQUFDLENBQUM7QUFJVSxRQUFBLDBDQUEwQyxHQUFzQjtJQUMzRTtRQUNFLE9BQU8sRUFBRSxxQ0FBcUM7UUFDOUMsTUFBTSxFQUFFLE1BQU07UUFDZCxXQUFXLEVBQUUsQ0FBQyxJQUFBLG9DQUF3QixFQUFDLHNDQUE4QixDQUFDLENBQUM7S0FDeEU7SUFDRDtRQUNFLE9BQU8sRUFBRSxxQ0FBcUM7UUFDOUMsTUFBTSxFQUFFLEtBQUs7UUFDYixXQUFXLEVBQUUsQ0FBQyxJQUFBLG9DQUF3QixFQUFDLHNDQUE4QixDQUFDLENBQUM7S0FDeEU7SUFDRDtRQUNFLE9BQU8sRUFBRSxxQ0FBcUM7UUFDOUMsTUFBTSxFQUFFLFFBQVE7UUFDaEIsV0FBVyxFQUFFLEVBQUU7S0FDaEI7Q0FDRixDQUFDIn0=