import { FlagSettings } from "@medusajs/framework/feature-flags"

const CustomerReviewsFeatureFlag: FlagSettings = {
  key: "customer_reviews",
  default_val: true,
  env_key: "MEDUSA_FF_CUSTOMER_REVIEWS",
  description: "Enable or disable customer product reviews",
}

export default CustomerReviewsFeatureFlag
