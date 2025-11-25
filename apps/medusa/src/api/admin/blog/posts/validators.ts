import { z } from "zod"

export const PostAdminCreatePost = z.object({
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    language: z.string(),
    thumbnail: z.string(),
    description: z.string().optional(),
    sub_title: z.string().optional(),
    published: z.boolean(),
})