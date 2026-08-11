"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const location_1 = require("../../../modules/location");
const zod_1 = require("zod");
const createLocationSchema = zod_1.z.object({
    iso_country_code: zod_1.z.string().min(2).max(2),
    name: zod_1.z.string().min(1),
    address_lines: zod_1.z.string().min(1),
    options: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        value: zod_1.z.string(),
        type: zod_1.z.string(),
    })).optional().default([]),
});
const POST = async (req, res) => {
    try {
        const locationService = req.scope.resolve(location_1.LOCATION_MODULE);
        const validatedData = createLocationSchema.parse(req.body);
        const location = await locationService.createLocations(validatedData);
        res.status(201).json({ location: location });
    }
    catch (error) {
        if (error.name === "ZodError") {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            message: error.message || "Failed to create location",
        });
    }
};
exports.POST = POST;
const GET = async (req, res) => {
    try {
        const query = req.scope.resolve("query");
        const { iso_country_code, offset, limit, order } = req.query;
        // Build filters
        const filters = {};
        if (iso_country_code) {
            filters.iso_country_code = iso_country_code;
        }
        // Build pagination
        const pagination = {
            skip: offset ? parseInt(offset) : 0,
            take: limit ? parseInt(limit) : 20,
        };
        // Build order
        if (order) {
            pagination.order = {};
            const orderParts = order.split(",");
            for (const part of orderParts) {
                const [field, direction] = part.trim().split(":");
                pagination.order[field] = direction?.toUpperCase() || "ASC";
            }
        }
        else {
            // Default order by created_at
            pagination.order = {
                created_at: "DESC",
            };
        }
        const { data: locations, metadata: { count, take, skip } = {}, } = await query.graph({
            entity: "location",
            fields: [
                "id",
                "iso_country_code",
                "name",
                "address_lines",
                "options",
            ],
            filters,
            pagination,
        });
        res.status(200).json({
            locations: locations,
            count,
            limit: take,
            offset: skip,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Failed to fetch locations",
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2xvY2F0aW9uL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLHdEQUEyRDtBQUMzRCw2QkFBdUI7QUFFdkIsTUFBTSxvQkFBb0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2xDLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQyxJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkIsYUFBYSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE9BQU8sRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLE9BQUMsQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDaEIsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDakIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7S0FDbkIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztDQUM3QixDQUFDLENBQUE7QUFJSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3JCLEdBQXVDLEVBQ3ZDLEdBQW1CLEVBQ3JCLEVBQUU7SUFDQSxJQUFJLENBQUM7UUFDRCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBZSxDQUFDLENBQUE7UUFDMUQsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUUxRCxNQUFNLFFBQVEsR0FBRyxNQUFNLGVBQWUsQ0FBQyxlQUFl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