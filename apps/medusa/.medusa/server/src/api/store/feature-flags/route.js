"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const runtime_store_1 = require("../../../api/admin/feature-flags/runtime-store");
// GET /store/feature-flags - Get feature flag statuses for storefront
const GET = async (req, res) => {
    res.json({
        feature_flags: {
            customer_reviews: runtime_store_1.runtimeFeatureFlags.get("customer_reviews")
                ?? utils_1.FeatureFlag.isFeatureEnabled("customer_reviews"),
        },
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2ZlYXR1cmUtZmxhZ3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXVEO0FBQ3ZELGtGQUFvRjtBQUVwRixzRUFBc0U7QUFDL0QsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxhQUFhLEVBQUU7WUFDYixnQkFBZ0IsRUFBRSxtQ0FBbUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7bUJBQ3hELG1CQUFXLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7U0FDdEQ7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFQWSxRQUFBLEdBQUcsT0FPZiJ9