import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  createPostWorkflow,
} from "../../../../workflows/create-post"
import { z } from "zod"
import { PostAdminCreatePost } from "./validators"
type PostAdminCreatePostType = z.infer<typeof PostAdminCreatePost>

export const POST = async (
  req: MedusaRequest<PostAdminCreatePostType>,
  res: MedusaResponse
) => {
  const { result } = await createPostWorkflow(req.scope)
    .run({
      input: req.validatedBody,
    })

  res.json({ post: result })
}
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

  const {
    data: posts,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "post",
    ...req.queryConfig,
  })

  res.json({
    posts,
    count,
    limit: take,
    offset: skip,
  })
}