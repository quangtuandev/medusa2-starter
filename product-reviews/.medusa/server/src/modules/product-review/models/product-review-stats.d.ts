export declare const ProductReviewStatsModel: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
    id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
    product_id: import("@medusajs/framework/utils").TextProperty;
    average_rating: import("@medusajs/framework/utils").NullableModifier<number, import("@medusajs/framework/utils").NumberProperty>;
    review_count: import("@medusajs/framework/utils").NumberProperty;
    rating_count_1: import("@medusajs/framework/utils").NumberProperty;
    rating_count_2: import("@medusajs/framework/utils").NumberProperty;
    rating_count_3: import("@medusajs/framework/utils").NumberProperty;
    rating_count_4: import("@medusajs/framework/utils").NumberProperty;
    rating_count_5: import("@medusajs/framework/utils").NumberProperty;
}>, "product_review_stats">;
