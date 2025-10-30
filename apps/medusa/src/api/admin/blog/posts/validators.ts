import { z } from "zod"

export const PostAdminCreatePost = z.object({
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    thumbnail: z.string(),
    description: z.string(),
    sub_title: z.string(),
    published: z.boolean(),
})