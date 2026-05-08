"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const utils_1 = require("@medusajs/framework/utils");
const runtime_store_1 = require("./runtime-store");
// GET /admin/feature-flags - Get all feature flag statuses
const GET = async (req, res) => {
    const flags = {
        customer_reviews: runtime_store_1.runtimeFeatureFlags.get("customer_reviews")
            ?? utils_1.FeatureFlag.isFeatureEnabled("customer_reviews"),
    };
    res.json({ feature_flags: flags });
};
exports.GET = GET;
// POST /admin/feature-flags - Update feature flag statuses
const POST = async (req, res) => {
    const { feature_flags } = req.body;
    if (!feature_flags || typeof feature_flags !== "object") {
        return res.status(400).json({ error: "feature_flags object is required" });
    }
    // Update runtime flags
    for (const [key, value] of Object.entries(feature_flags)) {
        if (typeof value === "boolean") {
            runtime_store_1.runtimeFeatureFlags.set(key, value);
        }
    }
    const updatedFlags = {
        customer_reviews: runtime_store_1.runtimeFeatureFlags.get("customer_reviews")
            ?? utils_1.FeatureFlag.isFeatureEnabled("customer_reviews"),
    };
    res.json({
        feature_flags: updatedFlags,
        message: "Feature flags updated successfully"
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2ZlYXR1cmUtZmxhZ3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXVEO0FBQ3ZELG1EQUFxRDtBQUVyRCwyREFBMkQ7QUFDcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sS0FBSyxHQUFHO1FBQ1osZ0JBQWdCLEVBQUUsbUNBQW1CLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO2VBQ3hELG1CQUFXLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7S0FDdEQsQ0FBQTtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUNwQyxDQUFDLENBQUE7QUFQWSxRQUFBLEdBQUcsT0FPZjtBQUVELDJEQUEyRDtBQUNwRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDcEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFrRCxDQUFBO0lBRWhGLElBQUksQ0FBQyxhQUFhLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDeEQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUE7SUFDNUUsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQ3pELElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDL0IsbUNBQW1CLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNyQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sWUFBWSxHQUFHO1FBQ25CLGdCQUFnQixFQUFFLG1DQUFtQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztlQUN4RCxtQkFBVyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0tBQ3RELENBQUE7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ1AsYUFBYSxFQUFFLFlBQVk7UUFDM0IsT0FBTyxFQUFFLG9DQUFvQztLQUM5QyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUF2QlksUUFBQSxJQUFJLFFBdUJoQiJ9