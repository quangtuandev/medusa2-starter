"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { slug } = req.params;
    const lang = req.query.lang || "en";
    const { data: pages } = await query.graph({
        entity: "page",
        fields: ["id", "title", "slug", "content", "language", "meta_title", "meta_description", "created_at", "updated_at"],
        filters: {
            published: true,
            slug,
            language: lang,
        },
    });
    if (!pages || pages.length === 0) {
        res.status(404).json({ error: "Page not found" });
        return;
    }
    res.json(pages[0]);
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3BhZ2VzL1tzbHVnXS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDakUsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7SUFDM0IsTUFBTSxJQUFJLEdBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFlLElBQUksSUFBSSxDQUFBO0lBRS9DLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RDLE1BQU0sRUFBRSxNQUFNO1FBQ2QsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztRQUNwSCxPQUFPLEVBQUU7WUFDTCxTQUFTLEVBQUUsSUFBSTtZQUNmLElBQUk7WUFDSixRQUFRLEVBQUUsSUFBSTtTQUNqQjtLQUNKLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7UUFDakQsT0FBTTtJQUNWLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLENBQUMsQ0FBQTtBQXJCWSxRQUFBLEdBQUcsT0FxQmYifQ==