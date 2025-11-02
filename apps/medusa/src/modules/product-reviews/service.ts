import { MedusaService } from "@medusajs/framework/utils"
import { Review } from "./models/review"

class ProductReviewsModuleService extends MedusaService({
  Review,
}) {
  /**
   * Create a new review
   */
  async createReview(data: {
    product_id: string
    name: string
    content: string
    stars: number
  }) {
    // Validate stars
    if (data.stars < 1 || data.stars > 5) {
      throw new Error("Stars must be between 1 and 5")
    }

    return await this.createReviews({
      ...data,
      status: "pending",
    })
  }

  /**
   * Approve a review
   */
  async approveReview(id: string) {
    const review = await this.retrieveReview(id)
    if (!review) {
      throw new Error("Review not found")
    }

    return await this.updateReviews([{ id, status: "approved" }])
  }

  // /**
  //  * Reject a review
  //  */
  // async rejectReview(id: string) {
  //   const review = await this.retrieveReview(id)
  //   if (!review) {
  //     throw new Error("Review not found")
  //   }

  //   return await this.updateReviews(id, {
  //     status: "rejected",
  //   })
  // }

  /**
   * Delete a review
   */
  async deleteReview(id: string) {
    const review = await this.retrieveReview(id)
    if (!review) {
      throw new Error("Review not found")
    }

    await this.deleteReviews(id)
    return true
  }
}

export default ProductReviewsModuleService
