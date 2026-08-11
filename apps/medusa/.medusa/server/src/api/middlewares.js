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
    locales: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
const SyncBulkProductsSchema = zod_1.z.object({
    product_ids: zod_1.z.array(zod_1.z.string()).min(1),
    locales: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUlpQztBQUNqQyw4REFBbUU7QUFDbkUseURBQThEO0FBQzlELHNFQUF3RTtBQUN4RSw2QkFBdUI7QUFFVixRQUFBLGNBQWMsR0FBRyxJQUFBLDZCQUFnQixHQUFFLENBQUE7QUFDbkMsUUFBQSxjQUFjLEdBQUcsSUFBQSw2QkFBZ0IsR0FBRSxDQUFBO0FBRWhELGdDQUFnQztBQUNoQyxNQUFNLGlCQUFpQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUU7Q0FDcEQsQ0FBQyxDQUFBO0FBRUYsTUFBTSxzQkFBc0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3BDLFdBQVcsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtDQUNwRCxDQUFDLENBQUE7QUFFRixrQkFBZSxJQUFBLHdCQUFpQixFQUFDO0lBQzdCLE1BQU0sRUFBRTtRQUNKO1lBQ0ksT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLGdDQUFtQixDQUFDO2FBQ2hEO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsTUFBTSxFQUFFLEtBQUs7WUFDYixXQUFXLEVBQUU7Z0JBQ1QsSUFBQSxnQ0FBeUIsRUFDckIsc0JBQWMsRUFDZCxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUMzRjthQUNKO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFO2dCQUNULElBQUEsK0JBQXdCLEVBQUMsZ0NBQW1CLENBQUM7YUFDaEQ7U0FDSjtRQUNEO1lBQ0ksT0FBTyxFQUFFLGNBQWM7WUFDdkIsTUFBTSxFQUFFLEtBQUs7WUFDYixXQUFXLEVBQUU7Z0JBQ1QsSUFBQSxnQ0FBeUIsRUFDckIsc0JBQWMsRUFDZCxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FDNUg7YUFDSjtTQUNKO1FBQ0Q7WUFDSSxPQUFPLEVBQUUsd0JBQXdCO1lBQ2pDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFO2dCQUNULElBQUEsK0JBQXdCLEVBQUMsaUJBQWlCLENBQUM7YUFDOUM7U0FDSjtRQUNEO1lBQ0ksT0FBTyxFQUFFLDZCQUE2QjtZQUN0QyxNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLHNCQUFzQixDQUFDO2FBQ25EO1NBQ0o7S0FDSjtDQUNKLENBQUMsQ0FBQSJ9