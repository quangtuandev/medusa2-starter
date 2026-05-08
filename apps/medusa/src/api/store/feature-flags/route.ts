import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { FeatureFlag } from "@medusajs/framework/utils"
import { runtimeFeatureFlags } from "../../../api/admin/feature-flags/runtime-store"

// GET /store/feature-flags - Get feature flag statuses for storefront
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    feature_flags: {
      customer_reviews: runtimeFeatureFlags.get("customer_reviews") 
        ?? FeatureFlag.isFeatureEnabled("customer_reviews"),
    },
  })
}
