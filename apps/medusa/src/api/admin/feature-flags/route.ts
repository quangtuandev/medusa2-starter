import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FeatureFlag } from "@medusajs/framework/utils"
import { runtimeFeatureFlags } from "./runtime-store"

// GET /admin/feature-flags - Get all feature flag statuses
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const flags = {
    customer_reviews: runtimeFeatureFlags.get("customer_reviews") 
      ?? FeatureFlag.isFeatureEnabled("customer_reviews"),
    translation: runtimeFeatureFlags.get("translation") 
      ?? FeatureFlag.isFeatureEnabled("translation")
      ?? true,
  }

  res.json({ feature_flags: flags })
}

// POST /admin/feature-flags - Update feature flag statuses
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { feature_flags } = req.body as { feature_flags: Record<string, boolean> }

  if (!feature_flags || typeof feature_flags !== "object") {
    return res.status(400).json({ error: "feature_flags object is required" })
  }

  // Update runtime flags
  for (const [key, value] of Object.entries(feature_flags)) {
    if (typeof value === "boolean") {
      runtimeFeatureFlags.set(key, value)
    }
  }

  const updatedFlags = {
    customer_reviews: runtimeFeatureFlags.get("customer_reviews")
      ?? FeatureFlag.isFeatureEnabled("customer_reviews"),
    translation: runtimeFeatureFlags.get("translation") 
      ?? FeatureFlag.isFeatureEnabled("translation")
      ?? true,
  }

  res.json({ 
    feature_flags: updatedFlags,
    message: "Feature flags updated successfully" 
  })
}
