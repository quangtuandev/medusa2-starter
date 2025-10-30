import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  const { slug } = req.params;
  const { data: post } = await query.graph({
    entity: "post",
    fields: ["id", "title", "description", "slug", "sub_title", "content", "thumbnail", "created_at", "updated_at"],
    filters: {
      published: true,
      slug: slug,
    },
    pagination: {
      order: {
        created_at: "DESC",
      }
    },
  })
  res.json({ post })
}
