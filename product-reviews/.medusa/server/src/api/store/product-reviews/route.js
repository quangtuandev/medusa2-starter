"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const upsert_product_reviews_1 = require("../../../workflows/upsert-product-reviews");
const middlewares_1 = require("./middlewares");
const GET = async (req, res) => {
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: product_reviews, metadata = { count: 0, skip: 0, take: 0 } } = await query.graph({
        entity: 'product_review',
        ...req.queryConfig,
        filters: {
            ...req.filterableFields,
        },
    });
    res.status(200).json({ product_reviews, count: metadata.count, offset: metadata.skip, limit: metadata.take });
};
exports.GET = GET;
const POST = async (req, res) => {
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { reviews } = req.validatedBody;
    const { result } = await (0, upsert_product_reviews_1.upsertProductReviewsWorkflow)(req.scope).run({ input: { reviews } });
    const createdReviewIds = result.creates.map((review) => review.id);
    const updatedReviewIds = result.updates.map((review) => review.id);
    const { data: product_reviews } = await query.graph({
        entity: 'product_review',
        fields: [...middlewares_1.defaultStoreProductReviewFields],
        filters: {
            id: [...createdReviewIds, ...updatedReviewIds],
        }
    });
    res.status(200).json({ product_reviews });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3QtcmV2aWV3cy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBc0U7QUFDdEUsc0ZBQXlGO0FBQ3pGLCtDQUE0RjtBQUVyRixNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBK0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDaEYsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFakUsTUFBTSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsUUFBUSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUM3RixNQUFNLEVBQUUsZ0JBQWdCO1FBQ3hCLEdBQUcsR0FBRyxDQUFDLFdBQVc7UUFDbEIsT0FBTyxFQUFFO1lBQ1AsR0FBRyxHQUFHLENBQUMsZ0JBQWdCO1NBQ3hCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hILENBQUMsQ0FBQztBQVpXLFFBQUEsR0FBRyxPQVlkO0FBRUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQTJELEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQzdHLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO0lBRXRDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEscURBQTRCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU3RixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBSW5FLE1BQU0sRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ2xELE1BQU0sRUFBRSxnQkFBZ0I7UUFDeEIsTUFBTSxFQUFFLENBQUMsR0FBRyw2Q0FBK0IsQ0FBQztRQUM1QyxPQUFPLEVBQUU7WUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLEdBQUcsZ0JBQWdCLENBQUM7U0FDL0M7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBcEJXLFFBQUEsSUFBSSxRQW9CZiJ9