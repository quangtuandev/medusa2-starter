"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const normalizeSlug = (value) => (value || "")
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .pop() || "";
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const rawSlug = decodeURIComponent(req.params.slug || "");
    const fields = ["id", "title", "description", "slug", "sub_title", "content", "thumbnail", "created_at", "updated_at"];
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
    });
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
        });
        const targetClean = normalizeSlug(rawSlug).toLowerCase();
        const matched = (allPublished || []).find((item) => item.id === rawSlug ||
            (item.slug && normalizeSlug(item.slug).toLowerCase() === targetClean));
        post = matched ? [matched] : [];
    }
    res.json({ post });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Bvc3QvW3NsdWddL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBcUIsRUFBRSxFQUFFLENBQzlDLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztLQUNWLElBQUksRUFBRTtLQUNOLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7S0FDakMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7S0FDekIsS0FBSyxDQUFDLEdBQUcsQ0FBQztLQUNWLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQTtBQUVULE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN6RCxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFFdEgsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDckMsTUFBTSxFQUFFLE1BQU07UUFDZCxNQUFNO1FBQ04sT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFLElBQUk7WUFDZixJQUFJLEVBQUUsT0FBTztTQUNkO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsS0FBSyxFQUFFO2dCQUNMLFVBQVUsRUFBRSxNQUFNO2FBQ25CO1NBQ0Y7S0FDRixDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDL0IsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDL0MsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNO1lBQ04sT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRTtvQkFDTCxVQUFVLEVBQUUsTUFBTTtpQkFDbkI7YUFDRjtTQUNGLENBQUMsQ0FBQTtRQUNGLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN4RCxNQUFNLE9BQU8sR0FBRyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQ3ZDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FDWixJQUFJLENBQUMsRUFBRSxLQUFLLE9BQU87WUFDbkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssV0FBVyxDQUFDLENBQ3hFLENBQUE7UUFDRCxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDakMsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3BCLENBQUMsQ0FBQTtBQTFDWSxRQUFBLEdBQUcsT0EwQ2YifQ==