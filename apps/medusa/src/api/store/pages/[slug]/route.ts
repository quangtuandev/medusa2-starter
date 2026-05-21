import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const query = req.scope.resolve("query")
    const { slug } = req.params
    const lang = (req.query.lang as string) || "en"

    const { data: pages } = await query.graph({
        entity: "page",
        fields: ["id", "title", "slug", "content", "language", "meta_title", "meta_description", "created_at", "updated_at"],
        filters: {
            published: true,
            slug,
            language: lang,
        },
    })

    if (!pages || pages.length === 0) {
        res.status(404).json({ error: "Page not found" })
        return
    }

    res.json(pages[0])
}
