"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsSchema = void 0;
const http_1 = require("@medusajs/framework/http");
const validators_1 = require("./admin/blog/posts/validators");
const validators_2 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
exports.GetPostsSchema = (0, validators_2.createFindParams)();
// Contentful validation schemas
const SyncProductSchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1),
    locales: zod_1.z.record(zod_1.z.any()).optional(),
});
const SyncBulkProductsSchema = zod_1.z.object({
    product_ids: zod_1.z.array(zod_1.z.string()).min(1),
    locales: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        {
            matcher: "/admin/blog/posts",
            method: "POST",
            middlewares: [
                (0, http_1.validateAndTransformBody)(validators_1.PostAdminCreatePost),
            ],
        },
        {
            matcher: "/admin/blog/posts",
            method: "GET",
            middlewares: [
                (0, http_1.validateAndTransformQuery)(exports.GetPostsSchema, { isList: true, defaults: ["id", "title", "content", "slug", "thumbnail", "published"] }),
            ],
        },
        {
            matcher: "/admin/contentful/sync",
            method: "POST",
            middlewares: [
                (0, http_1.validateAndTransformBody)(SyncProductSchema),
            ],
        },
        {
            matcher: "/admin/contentful/sync/bulk",
            method: "POST",
            middlewares: [
                (0, http_1.validateAndTransformBody)(SyncBulkProductsSchema),
            ],
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUlpQztBQUNqQyw4REFBbUU7QUFDbkUsc0VBQXdFO0FBQ3hFLDZCQUF1QjtBQUVWLFFBQUEsY0FBYyxHQUFHLElBQUEsNkJBQWdCLEdBQUUsQ0FBQTtBQUVoRCxnQ0FBZ0M7QUFDaEMsTUFBTSxpQkFBaUIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQy9CLFVBQVUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDeEMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxzQkFBc0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3BDLFdBQVcsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsT0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO0NBQ3hDLENBQUMsQ0FBQTtBQUVGLGtCQUFlLElBQUEsd0JBQWlCLEVBQUM7SUFDN0IsTUFBTSxFQUFFO1FBQ0o7WUFDSSxPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFO2dCQUNULElBQUEsK0JBQXdCLEVBQUMsZ0NBQW1CLENBQUM7YUFDaEQ7U0FDSjtRQUNEO1lBQ0ksT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixNQUFNLEVBQUUsS0FBSztZQUNiLFdBQVcsRUFBRTtnQkFDVCxJQUFBLGdDQUF5QixFQUNyQixzQkFBYyxFQUNkLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQzNGO2FBQ0o7U0FDSjtRQUNEO1lBQ0ksT0FBTyxFQUFFLHdCQUF3QjtZQUNqQyxNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLGlCQUFpQixDQUFDO2FBQzlDO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSw2QkFBNkI7WUFDdEMsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUU7Z0JBQ1QsSUFBQSwrQkFBd0IsRUFBQyxzQkFBc0IsQ0FBQzthQUNuRDtTQUNKO0tBQ0o7Q0FDSixDQUFDLENBQUEifQ==