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