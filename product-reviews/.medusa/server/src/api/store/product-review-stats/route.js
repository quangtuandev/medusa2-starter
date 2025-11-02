"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const GET = async (req, res) => {
    const remoteQuery = req.scope.resolve('remoteQuery');
    const queryObject = (0, utils_1.remoteQueryObjectFromString)({
        entryPoint: 'product_review_stats',
        variables: {
            filters: req.filterableFields,
            ...req.queryConfig.pagination,
        },
        fields: req.queryConfig.fields,
    });
    const { rows: product_review_stats, metadata } = await remoteQuery(queryObject);
    res.status(200).json({ product_review_stats, count: metadata.count, offset: metadata.skip, limit: metadata.take });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3QtcmV2aWV3LXN0YXRzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFEQUF3RTtBQUVqRSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBK0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDaEYsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFckQsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQ0FBMkIsRUFBQztRQUM5QyxVQUFVLEVBQUUsc0JBQXNCO1FBQ2xDLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxHQUFHLENBQUMsZ0JBQWdCO1lBQzdCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVO1NBQzlCO1FBQ0QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBbUU7S0FDNUYsQ0FBQyxDQUFDO0lBRUgsTUFBTSxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVoRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLG9CQUFvQixFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNySCxDQUFDLENBQUM7QUFmVyxRQUFBLEdBQUcsT0FlZCJ9