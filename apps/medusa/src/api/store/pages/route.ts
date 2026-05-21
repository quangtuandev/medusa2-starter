import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const query = req.scope.resolve("query")
    const lang = (req.query.lang as string) || "en"

    const { data: pages } = await query.graph({
        entity: "page",
        fields: ["id", "title", "slug", "language"],
        filters: {
            published: true,
            language: lang,
        },
        pagination: {
            order: {
                created_at: "ASC",
            },
        },
    })

    res.json(pages)
}
