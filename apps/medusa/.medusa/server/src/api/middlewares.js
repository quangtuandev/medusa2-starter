"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsSchema = void 0;
const http_1 = require("@medusajs/framework/http");
const validators_1 = require("./admin/blog/posts/validators");
const validators_2 = require("@medusajs/medusa/api/utils/validators");
exports.GetPostsSchema = (0, validators_2.createFindParams)();
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
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUlpQztBQUNqQyw4REFBbUU7QUFDbkUsc0VBQXdFO0FBRTNELFFBQUEsY0FBYyxHQUFHLElBQUEsNkJBQWdCLEdBQUUsQ0FBQTtBQUVoRCxrQkFBZSxJQUFBLHdCQUFpQixFQUFDO0lBQzdCLE1BQU0sRUFBRTtRQUNKO1lBQ0ksT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixNQUFNLEVBQUUsTUFBTTtZQUNkLFdBQVcsRUFBRTtnQkFDVCxJQUFBLCtCQUF3QixFQUFDLGdDQUFtQixDQUFDO2FBQ2hEO1NBQ0o7UUFDRDtZQUNJLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsTUFBTSxFQUFFLEtBQUs7WUFDYixXQUFXLEVBQUU7Z0JBQ1QsSUFBQSxnQ0FBeUIsRUFDckIsc0JBQWMsRUFDZCxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUMzRjthQUNKO1NBQ0o7S0FDSjtDQUNKLENBQUMsQ0FBQSJ9