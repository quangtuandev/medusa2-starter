import type { AuthenticatedMedusaRequest, MedusaContainer, MedusaResponse } from '@medusajs/framework';
import type { CreateProductReviewResponseDTO } from './middlewares';
export declare const fetchReviewResponse: (container: MedusaContainer, filter: {
    id: string;
} | {
    product_review_id: string;
}) => Promise<{
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
}>;
export declare const fetchReviewWithResponse: (container: MedusaContainer, id: string) => Promise<{
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
    response: {
        id: string;
        content: string;
        product_review: /*elided*/ any;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        product_review_id: string;
    };
    status: "pending" | "approved" | "flagged";
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}>;
export declare const POST: (req: AuthenticatedMedusaRequest<CreateProductReviewResponseDTO>, res: MedusaResponse) => Promise<void>;
export declare const PUT: (req: AuthenticatedMedusaRequest<CreateProductReviewResponseDTO>, res: MedusaResponse) => Promise<void>;
export declare const DELETE: (req: AuthenticatedMedusaRequest, res: MedusaResponse) => Promise<void>;
