"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const runtime_store_1 = require("../../../admin/feature-flags/runtime-store");
// GET /store/reviews/:product_id - Get approved reviews for a product
const GET = async (req, res) => {
    const reviewsEnabled = runtime_store_1.runtimeFeatureFlags.get("customer_reviews")
        ?? utils_1.FeatureFlag.isFeatureEnabled("customer_reviews");
    if (!reviewsEnabled) {
        return res.sendStatus(404);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3MvW3Byb2R1Y3RfaWRdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFEQUF1RDtBQUN2RCw4RUFBZ0Y7QUFFaEYsc0VBQXNFO0FBQy9ELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxNQUFNLGNBQWMsR0FBRyxtQ0FBbUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7V0FDN0QsbUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQ3JELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwQixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO1FBQ2pDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtRQUVuQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNoRixNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7WUFDcEYsT0FBTyxFQUFFO2dCQUNQLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixNQUFNLEVBQUUsVUFBVTthQUNuQjtZQUNELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUU7b0JBQ0wsVUFBVSxFQUFFLE1BQU07aUJBQ25CO2dCQUNELElBQUksRUFBRSxRQUFRLENBQUMsTUFBZ0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBZSxDQUFDLElBQUksRUFBRTthQUN0QztTQUNGLENBQUMsQ0FBQTtRQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxPQUFPO1lBQ1AsS0FBSyxFQUFFLElBQUk7WUFDWCxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUs7U0FDTixDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUVwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSx5QkFBeUI7U0FDbEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQTtBQXhDWSxRQUFBLEdBQUcsT0F3Q2YifQ==