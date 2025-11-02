import Service from './service';
export declare const PRODUCT_REVIEW_MODULE = "product_review";
declare const _default: import("@medusajs/types").ModuleExports<typeof Service> & {
    linkable: {
        readonly productReview: {
            id: {
                serviceName: "product_review";
                field: "productReview";
                linkable: "product_review_id";
                primaryKey: "id";
            };
            toJSON: () => {
                serviceName: "product_review";
                field: "productReview";
                linkable: "product_review_id";
                primaryKey: "id";
            };
        };
        readonly productReviewImage: {
            id: {
                serviceName: "product_review";
                field: "productReviewImage";
                linkable: "product_review_image_id";
                primaryKey: "id";
            };
            toJSON: () => {
                serviceName: "product_review";
                field: "productReviewImage";
                linkable: "product_review_image_id";
                primaryKey: "id";
            };
        };
        readonly productReviewResponse: {
            id: {
                serviceName: "product_review";
                field: "productReviewResponse";
                linkable: "product_review_response_id";
                primaryKey: "id";
            };
            toJSON: () => {
                serviceName: "product_review";
                field: "productReviewResponse";
                linkable: "product_review_response_id";
                primaryKey: "id";
            };
        };
        readonly productReviewStats: {
            id: {
                serviceName: "product_review";
                field: "productReviewStats";
                linkable: "product_review_stats_id";
                primaryKey: "id";
            };
            toJSON: () => {
                serviceName: "product_review";
                field: "productReviewStats";
                linkable: "product_review_stats_id";
                primaryKey: "id";
            };
        };
    };
};
export default _default;
