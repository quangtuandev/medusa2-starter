import { ProductReview } from '../modules/product-review/types/common';
export type UpsertProductReviewsWorkflowInput = {
    reviews: {
        order_id: string;
        order_line_item_id: string;
        rating: number;
        content: string;
        images: {
            url: string;
        }[];
    }[];
};
export declare const upsertProductReviewsWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpsertProductReviewsWorkflowInput, {
    creates: ProductReview[];
    updates: ProductReview[];
}, []>;
