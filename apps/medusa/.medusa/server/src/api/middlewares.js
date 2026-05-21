"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPagesSchema = exports.GetPostsSchema = void 0;
const http_1 = require("@medusajs/framework/http");
const validators_1 = require("./admin/blog/posts/validators");
const validators_2 = require("./admin/pages/validators");
const validators_3 = require("@medusajs/medusa/api/utils/validators");
const zod_1 = require("zod");
exports.GetPostsSchema = (0, validators_3.createFindParams)();
exports.GetPagesSchema = (0, validators_3.createFindParams)();
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
            matcher: "/admin/pages",
            method: "POST",
            middlewares: [
                (0, http_1.validateAndTransformBody)(validators_2.PostAdminCreatePage),
            ],
        },
        {
            matcher: "/admin/pages",
            method: "GET",
            middlewares: [
                (0, http_1.validateAndTransformQuery)(exports.GetPagesSchema, { isList: true, defaults: ["id", "title", "slug", "content", "language", "meta_title", "meta_description", "published"] }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUlpQztBQUNqQyw4REFBbUU7QUFDbkUseURBQThEO0FBQzlELHNFQUF3RTtBQUN4RSw2QkFBdUI7QUFFVixRQUFBLGNBQWMsR0FBRyxJQUFBLDZCQUFnQixHQUFFLENBQUE7QUFDbkMsUUFBQSxjQUFjLEdBQUcsSUFBQSw2QkFBZ0IsR0FBRSxDQUFBO0FBRWhELGdDQUFnQztBQUNoQyxNQUFNLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE9BQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtDQUN4QyxDQUFDLENBQUE7QUFFRixNQUFNLHNCQUFzQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDcEMsV0FBVyxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QyxPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDeEMsQ0FBQyxDQUFBO0FBRUYsa0JBQWUsSUFBQSx3QkFBaUIsRUFBQztJQUM3QixNQUFNLEVBQUU7UUFDSjtZQUNJLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUU7Z0JBQ1QsSUFBQSwrQkFBd0IsRUFBQyxnQ0FBbUIsQ0FBQzthQUNoRDtTQUNKO1FBQ0Q7WUFDSSxPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsV0FBVyxFQUFFO2dCQUNULElBQUEsZ0NBQXlCLEVBQ3JCLHNCQUFjLEVBQ2QsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FDM0Y7YUFDSjtTQUNKO1FBQ0Q7WUFDSSxPQUFPLEVBQUUsY0FBYztZQUN2QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLGdDQUFtQixDQUFDO2FBQ2hEO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsV0FBVyxFQUFFO2dCQUNULElBQUEsZ0NBQXlCLEVBQ3JCLHNCQUFjLEVBQ2QsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQzVIO2FBQ0o7U0FDSjtRQUNEO1lBQ0ksT0FBTyxFQUFFLHdCQUF3QjtZQUNqQyxNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLGlCQUFpQixDQUFDO2FBQzlDO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSw2QkFBNkI7WUFDdEMsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUU7Z0JBQ1QsSUFBQSwrQkFBd0IsRUFBQyxzQkFBc0IsQ0FBQzthQUNuRDtTQUNKO0tBQ0o7Q0FDSixDQUFDLENBQUEifQ==