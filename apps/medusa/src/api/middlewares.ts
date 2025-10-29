import {
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
} from "@medusajs/framework/http"
import { PostAdminCreatePost } from "./admin/blog/posts/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetPostsSchema = createFindParams()

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/blog/posts",
            method: "POST",
            middlewares: [
                validateAndTransformBody(PostAdminCreatePost),
            ],
        },
        {
            matcher: "/admin/blog/posts",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(
                    GetPostsSchema,
                    { isList: true, defaults: ["id", "title", "content", "slug", "thumbnail", "published"] }
                ),
            ],
        },
    ],
})