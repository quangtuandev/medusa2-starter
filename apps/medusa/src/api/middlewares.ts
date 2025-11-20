import {
    defineMiddlewares,
    validateAndTransformBody,
    validateAndTransformQuery,
} from "@medusajs/framework/http"
import { PostAdminCreatePost } from "./admin/blog/posts/validators"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const GetPostsSchema = createFindParams()

// Contentful validation schemas
const SyncProductSchema = z.object({
    product_id: z.string().min(1),
    locales: z.record(z.any()).optional(),
})

const SyncBulkProductsSchema = z.object({
    product_ids: z.array(z.string()).min(1),
    locales: z.record(z.any()).optional(),
})

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
        {
            matcher: "/admin/contentful/sync",
            method: "POST",
            middlewares: [
                validateAndTransformBody(SyncProductSchema),
            ],
        },
        {
            matcher: "/admin/contentful/sync/bulk",
            method: "POST",
            middlewares: [
                validateAndTransformBody(SyncBulkProductsSchema),
            ],
        },
    ],
})