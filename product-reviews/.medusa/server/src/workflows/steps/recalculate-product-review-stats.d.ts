export declare const recalculateProductReviewStatsStepId = "recalculate-product-review-stats";
export declare const recalculateProductReviewStatsStep: import("@medusajs/framework/workflows-sdk").StepFunction<string[], {
    id: string;
    product_id: string;
    average_rating: number | null;
    review_count: number;
    rating_count_1: number;
    rating_count_2: number;
    rating_count_3: number;
    rating_count_4: number;
    rating_count_5: number;
    raw_average_rating: Record<string, unknown> | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}[]>;
