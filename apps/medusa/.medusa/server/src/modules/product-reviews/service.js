"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const review_1 = require("./models/review");
class ProductReviewsModuleService extends (0, utils_1.MedusaService)({
    Review: review_1.Review,
}) {
    /**
     * Create a new review
     */
    async createReview(data) {
        // Validate stars
        if (data.stars < 1 || data.stars > 5) {
            throw new Error("Stars must be between 1 and 5");
        }
        return await this.createReviews({
            ...data,
            status: "pending",
        });
    }
    /**
     * Approve a review
     */
    async approveReview(id) {
        const review = await this.retrieveReview(id);
        if (!review) {
            throw new Error("Review not found");
        }
        return await this.updateReviews([{ id, status: "approved" }]);
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
    async deleteReview(id) {
        const review = await this.retrieveReview(id);
        if (!review) {
            throw new Error("Review not found");
        }
        await this.deleteReviews(id);
        return true;
    }
}
exports.default = ProductReviewsModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtcmV2aWV3cy9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXlEO0FBQ3pELDRDQUF3QztBQUV4QyxNQUFNLDJCQUE0QixTQUFRLElBQUEscUJBQWEsRUFBQztJQUN0RCxNQUFNLEVBQU4sZUFBTTtDQUNQLENBQUM7SUFDQTs7T0FFRztJQUNILEtBQUssQ0FBQyxZQUFZLENBQUMsSUFLbEI7UUFDQyxpQkFBaUI7UUFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUNsRCxDQUFDO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDOUIsR0FBRyxJQUFJO1lBQ1AsTUFBTSxFQUFFLFNBQVM7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFVO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDckMsQ0FBQztRQUVELE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0lBRUQsTUFBTTtJQUNOLHFCQUFxQjtJQUNyQixNQUFNO0lBQ04sbUNBQW1DO0lBQ25DLGlEQUFpRDtJQUNqRCxtQkFBbUI7SUFDbkIsMENBQTBDO0lBQzFDLE1BQU07SUFFTiwwQ0FBMEM7SUFDMUMsMEJBQTBCO0lBQzFCLE9BQU87SUFDUCxJQUFJO0lBRUo7O09BRUc7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQVU7UUFDM0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUNyQyxDQUFDO1FBRUQsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztDQUNGO0FBRUQsa0JBQWUsMkJBQTJCLENBQUEifQ==