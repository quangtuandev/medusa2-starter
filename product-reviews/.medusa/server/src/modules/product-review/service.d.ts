import { Context } from '@medusajs/framework/types';
import { ProductReviewStats } from './types';
import { z } from 'zod';
interface CalculatedProductReviewStats {
    product_id: string;
    review_count: number;
    average_rating: number;
    rating_count_1: number;
    rating_count_2: number;
    rating_count_3: number;
    rating_count_4: number;
    rating_count_5: number;
}
export declare const modduleOptionsSchema: z.ZodDefault<z.ZodObject<{
    defaultReviewStatus: z.ZodDefault<z.ZodEnum<["pending", "approved", "flagged"]>>;
}, "strip", z.ZodTypeAny, {
    defaultReviewStatus: "pending" | "approved" | "flagged";
}, {
    defaultReviewStatus?: "pending" | "approved" | "flagged" | undefined;
}>>;
export type ModuleOptions = z.infer<typeof modduleOptionsSchema>;
declare const ProductReviewService_base: import("@medusajs/framework/utils").MedusaServiceReturnType<import("@medusajs/framework/utils").ModelConfigurationsToConfigTemplate<{
    readonly ProductReview: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
        id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
        name: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        email: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        rating: import("@medusajs/framework/utils").NumberProperty;
        content: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        order_line_item_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        product_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        order_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
        images: import("@medusajs/framework/utils").HasMany<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
            id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
            url: import("@medusajs/framework/utils").TextProperty;
            product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
        }>, "product_review_image">>;
        response: import("@medusajs/framework/utils").RelationNullableModifier<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
            id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
            content: import("@medusajs/framework/utils").TextProperty;
            product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
        }>, "product_review_response">, import("@medusajs/framework/utils").HasOne<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
            id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
            content: import("@medusajs/framework/utils").TextProperty;
            product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
        }>, "product_review_response">>, false>;
        status: import("@medusajs/framework/utils").EnumProperty<["pending", "approved", "flagged"]>;
    }>, "product_review">;
    readonly ProductReviewImage: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
        id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
        url: import("@medusajs/framework/utils").TextProperty;
        product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
            id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
            name: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            email: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            rating: import("@medusajs/framework/utils").NumberProperty;
            content: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            order_line_item_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            product_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            order_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            images: import("@medusajs/framework/utils").HasMany<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review_image">>;
            response: import("@medusajs/framework/utils").RelationNullableModifier<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
                id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
                content: import("@medusajs/framework/utils").TextProperty;
                product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
            }>, "product_review_response">, import("@medusajs/framework/utils").HasOne<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
                id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
                content: import("@medusajs/framework/utils").TextProperty;
                product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
            }>, "product_review_response">>, false>;
            status: import("@medusajs/framework/utils").EnumProperty<["pending", "approved", "flagged"]>;
        }>, "product_review">, undefined>;
    }>, "product_review_image">;
    readonly ProductReviewResponse: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
        id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
        content: import("@medusajs/framework/utils").TextProperty;
        product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
            id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
            name: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            email: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            rating: import("@medusajs/framework/utils").NumberProperty;
            content: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            order_line_item_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            product_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            order_id: import("@medusajs/framework/utils").NullableModifier<string, import("@medusajs/framework/utils").TextProperty>;
            images: import("@medusajs/framework/utils").HasMany<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
                id: import("@medusajs/framework/utils").PrimaryKeyModifier<string, import("@medusajs/framework/utils").IdProperty>;
                url: import("@medusajs/framework/utils").TextProperty;
                product_review: import("@medusajs/framework/utils").BelongsTo<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review">, undefined>;
            }>, "product_review_image">>;
            response: import("@medusajs/framework/utils").RelationNullableModifier<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review_response">, import("@medusajs/framework/utils").HasOne<() => import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder</*elided*/ any>, "product_review_response">>, false>;
            status: import("@medusajs/framework/utils").EnumProperty<["pending", "approved", "flagged"]>;
        }>, "product_review">, undefined>;
    }>, "product_review_response">;
    readonly ProductReviewStats: import("@medusajs/framework/utils").DmlEntity<import("@medusajs/framework/utils").DMLEntitySchemaBuilder<{
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
}>>;
declare class ProductReviewService extends ProductReviewService_base {
    readonly defaultReviewStatus: string;
    constructor(container: any, options: ModuleOptions);
    refreshProductReviewStats(productIds: string[], sharedContext?: Context): Promise<ProductReviewStats[]>;
    calculateProductReviewStats(productIds: string[], sharedContext?: Context): Promise<CalculatedProductReviewStats[]>;
}
export default ProductReviewService;
