import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const normalizeSlug = (value?: string | null) =>
  (value || "")
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .pop() || ""

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  const rawSlug = decodeURIComponent(req.params.slug || "")
  const fields = ["id", "title", "description", "slug", "sub_title", "content", "thumbnail", "created_at", "updated_at"]

  let { data: post } = await query.graph({
    entity: "post",
    fields,
    filters: {
      published: true,
      slug: rawSlug,
    },
    pagination: {
      order: {
        created_at: "DESC",
      },
    },
  })

  if (!post || post.length === 0) {
    const { data: allPublished } = await query.graph({
      entity: "post",
      fields,
      filters: {
        published: true,
      },
      pagination: {
        order: {
          created_at: "DESC",
        },
      },
    })
    const targetClean = normalizeSlug(rawSlug).toLowerCase()
    const matched = (allPublished || []).find(
      (item: any) =>
        item.id === rawSlug ||
        (item.slug && normalizeSlug(item.slug).toLowerCase() === targetClean)
    )
    post = matched ? [matched] : []
  }

  res.json({ post })
}
