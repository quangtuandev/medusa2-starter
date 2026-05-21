import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import {
    createPageWorkflow,
} from "../../../workflows/create-page"
import { z } from "zod"
import { PostAdminCreatePage } from "./validators"

type PostAdminCreatePageType = z.infer<typeof PostAdminCreatePage>

export const POST = async (
    req: MedusaRequest<PostAdminCreatePageType>,
    res: MedusaResponse
) => {
    const { result } = await createPageWorkflow(req.scope)
        .run({
            input: req.validatedBody,
        })

    res.json({ page: result })
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve("query")

    const {
        data: pages,
        metadata: { count, take, skip } = {},
    } = await query.graph({
        entity: "page",
        ...req.queryConfig,
        fields: ['id', 'title', 'slug', 'content', 'language', 'meta_title', 'meta_description', 'published', 'created_at', 'updated_at'],
    })

    res.json({
        pages,
        count,
        limit: take,
        offset: skip,
    })
}
