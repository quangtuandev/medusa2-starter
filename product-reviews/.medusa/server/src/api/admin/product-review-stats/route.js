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
            ...req.remoteQueryConfig.pagination,
        },
        fields: req.remoteQueryConfig.fields,
    });
    const { rows: product_review_stats, metadata } = await remoteQuery(queryObject);
    res.status(200).json({ product_review_stats, count: metadata.count, offset: metadata.skip, limit: metadata.take });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3QtcmV2aWV3LXN0YXRzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFEQUF3RTtBQUVqRSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBK0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDaEYsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFckQsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQ0FBMkIsRUFBQztRQUM5QyxVQUFVLEVBQUUsc0JBQXNCO1FBQ2xDLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxHQUFHLENBQUMsZ0JBQWdCO1lBQzdCLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFVBQVU7U0FDcEM7UUFDRCxNQUFNLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQW1FO0tBQ2xHLENBQUMsQ0FBQztJQUVILE1BQU0sRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFaEYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDckgsQ0FBQyxDQUFDO0FBZlcsUUFBQSxHQUFHLE9BZWQifQ==