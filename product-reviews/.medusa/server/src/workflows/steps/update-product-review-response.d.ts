import type { UpdateProductReviewResponseInput } from '../../modules/product-review/types/mutations';
export declare const updateProductReviewResponseStepId = "update-product-review-response-step";
export declare const updateProductReviewResponseStep: import("@medusajs/workflows-sdk").StepFunction<UpdateProductReviewResponseInput[], {
    id: string;
    content: string;
    product_review: {
        id: string;
        name: string | null;
        email: string | null;
        rating: number;
        content: string | null;
        order_line_item_id: string | null;
        product_id: string | null;
        order_id: string | null;
        images: {
            id: string;
            url: string;
            product_review: /*elided*/ any;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            product_review_id: string;
        }[];
        response: /*elided*/ any;
        status: "pending" | "approved" | "flagged";
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    };
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    product_review_id: string;
}[]>;
