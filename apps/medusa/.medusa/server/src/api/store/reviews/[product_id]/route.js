"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
// GET /store/reviews/:product_id - Get approved reviews for a product
const GET = async (req, res) => {
    try {
        const query = req.scope.resolve("query");
        const { product_id } = req.params;
        const { offset, limit } = req.query;
        const { data: reviews, metadata: { count, take, skip } = {} } = await query.graph({
            entity: "review",
            fields: ["id", "product_id", "name", "content", "stars", "created_at", "updated_at"],
            filters: {
                product_id: product_id,
                status: "approved",
            },
            pagination: {
                order: {
                    created_at: "DESC",
                },
                skip: parseInt(offset) ?? 0,
                take: parseInt(limit) ?? 10,
            },
        });
        res.json({
            reviews,
            limit: take,
            offset: skip,
            count
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message || "Failed to fetch reviews"
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3MvW3Byb2R1Y3RfaWRdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNFQUFzRTtBQUMvRCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEMsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7UUFDakMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO1FBRW5DLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2hGLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztZQUNwRixPQUFPLEVBQUU7Z0JBQ1AsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLE1BQU0sRUFBRSxVQUFVO2FBQ25CO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRTtvQkFDTCxVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Z0JBQ0QsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFnQixDQUFDLElBQUksQ0FBQztnQkFDckMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFlLENBQUMsSUFBSSxFQUFFO2FBQ3RDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNQLE9BQU87WUFDUCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osS0FBSztTQUNOLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBRXBCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLHlCQUF5QjtTQUNsRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBbENZLFFBQUEsR0FBRyxPQWtDZiJ9