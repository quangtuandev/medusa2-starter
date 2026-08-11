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
        translation: runtime_store_1.runtimeFeatureFlags.get("translation")
            ?? utils_1.FeatureFlag.isFeatureEnabled("translation")
            ?? true,
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
        translation: runtime_store_1.runtimeFeatureFlags.get("translation")
            ?? utils_1.FeatureFlag.isFeatureEnabled("translation")
            ?? true,
    };
    res.json({
        feature_flags: updatedFlags,
        message: "Feature flags updated successfully"
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2ZlYXR1cmUtZmxhZ3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EscURBQXVEO0FBQ3ZELG1EQUFxRDtBQUVyRCwyREFBMkQ7QUFDcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sS0FBSyxHQUFHO1FBQ1osZ0JBQWdCLEVBQUUsbUNBQW1CLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO2VBQ3hELG1CQUFXLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7UUFDckQsV0FBVyxFQUFFLG1DQUFtQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7ZUFDOUMsbUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7ZUFDM0MsSUFBSTtLQUNWLENBQUE7SUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDcEMsQ0FBQyxDQUFBO0FBVlksUUFBQSxHQUFHLE9BVWY7QUFFRCwyREFBMkQ7QUFDcEQsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBa0QsQ0FBQTtJQUVoRixJQUFJLENBQUMsYUFBYSxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQ3hELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFBO0lBQzVFLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztRQUN6RCxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQy9CLG1DQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDckMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLFlBQVksR0FBRztRQUNuQixnQkFBZ0IsRUFBRSxtQ0FBbUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7ZUFDeEQsbUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztRQUNyRCxXQUFXLEVBQUUsbUNBQW1CLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztlQUM5QyxtQkFBVyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztlQUMzQyxJQUFJO0tBQ1YsQ0FBQTtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDUCxhQUFhLEVBQUUsWUFBWTtRQUMzQixPQUFPLEVBQUUsb0NBQW9DO0tBQzlDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQTFCWSxRQUFBLElBQUksUUEwQmhCIn0=