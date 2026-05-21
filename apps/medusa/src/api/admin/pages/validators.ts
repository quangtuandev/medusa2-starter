import { z } from "zod"

export const PostAdminCreatePage = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(1),
    language: z.string().default("en"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    published: z.boolean().default(false),
})
