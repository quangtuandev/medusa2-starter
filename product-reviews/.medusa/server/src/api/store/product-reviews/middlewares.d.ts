import { type MiddlewareRoute } from '@medusajs/framework';
import { z } from 'zod';
import { ProductReview } from '../../../modules/product-review/types/common';
import { QueryConfig } from '@medusajs/types';
export declare const listStoreProductReviewsQuerySchema: z.ZodObject<{
    fields: z.ZodOptional<z.ZodString>;
} & {
    offset: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    limit: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    order: z.ZodOptional<z.ZodString> | z.ZodDefault<z.ZodOptional<z.ZodString>>;
    with_deleted: z.ZodEffects<z.ZodOptional<z.ZodBoolean>, boolean | undefined, unknown>;
} & {
    id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodUnion<[z.ZodEnum<["pending", "approved", "flagged"]>, z.ZodArray<z.ZodEnum<["pending", "approved", "flagged"]>, "many">]>>>;
    product_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    order_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    rating: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodArray<z.ZodNumber, "many">]>>;
    created_at: z.ZodOptional<z.ZodUnion<[any, z.ZodObject<{
        $eq: any;
        $ne: any;
        $in: any;
        $nin: any;
        $like: any;
        $ilike: any;
        $re: any;
        $contains: any;
        $gt: any;
        $gte: any;
        $lt: any;
        $lte: any;
    }, "strip", z.ZodTypeAny, {
        $eq?: any;
        $ne?: any;
        $in?: any;
        $nin?: any;
        $like?: any;
        $ilike?: any;
        $re?: any;
        $contains?: any;
        $gt?: any;
        $gte?: any;
        $lt?: any;
        $lte?: any;
    }, {
        $eq?: any;
        $ne?: any;
        $in?: any;
        $nin?: any;
        $like?: any;
        $ilike?: any;
        $re?: any;
        $contains?: any;
        $gt?: any;
        $gte?: any;
        $lt?: any;
        $lte?: any;
    }>]>>;
    updated_at: z.ZodOptional<z.ZodUnion<[any, z.ZodObject<{
        $eq: any;
        $ne: any;
        $in: any;
        $nin: any;
        $like: any;
        $ilike: any;
        $re: any;
        $contains: any;
        $gt: any;
        $gte: any;
        $lt: any;
        $lte: any;
    }, "strip", z.ZodTypeAny, {
        $eq?: any;
        $ne?: any;
        $in?: any;
        $nin?: any;
        $like?: any;
        $ilike?: any;
        $re?: any;
        $contains?: any;
        $gt?: any;
        $gte?: any;
        $lt?: any;
        $lte?: any;
    }, {
        $eq?: any;
        $ne?: any;
        $in?: any;
        $nin?: any;
        $like?: any;
        $ilike?: any;
        $re?: any;
        $contains?: any;
        $gt?: any;
        $gte?: any;
        $lt?: any;
        $lte?: any;
    }>]>>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    limit: number;
    status?: "pending" | "approved" | "flagged" | ("pending" | "approved" | "flagged")[] | undefined;
    id?: string | string[] | undefined;
    product_id?: string | string[] | undefined;
    order_id?: string | string[] | undefined;
    rating?: number | number[] | undefined;
    created_at?: any;
    updated_at?: any;
    fields?: string | undefined;
    order?: string | undefined;
    with_deleted?: boolean | undefined;
}, {
    offset?: unknown;
    limit?: unknown;
    status?: "pending" | "approved" | "flagged" | ("pending" | "approved" | "flagged")[] | undefined;
    id?: string | string[] | undefined;
    product_id?: string | string[] | undefined;
    order_id?: string | string[] | undefined;
    rating?: number | number[] | undefined;
    created_at?: any;
    updated_at?: any;
    fields?: string | undefined;
    order?: string | undefined;
    with_deleted?: unknown;
}>;
export declare const upsertProductReviewsSchema: z.ZodObject<{
    reviews: z.ZodArray<z.ZodObject<{
        order_id: z.ZodString;
        order_line_item_id: z.ZodString;
        rating: z.ZodNumber;
        content: z.ZodString;
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
        }, {
            url: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        order_id: string;
        rating: number;
        content: string;
        images: {
            url: string;
        }[];
        order_line_item_id: string;
    }, {
        order_id: string;
        rating: number;
        content: string;
        images: {
            url: string;
        }[];
        order_line_item_id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    reviews: {
        order_id: string;
        rating: number;
        content: string;
        images: {
            url: string;
        }[];
        order_line_item_id: string;
    }[];
}, {
    reviews: {
        order_id: string;
        rating: number;
        content: string;
        images: {
            url: string;
        }[];
        order_line_item_id: string;
    }[];
}>;
export type UpsertProductReviewsSchema = z.infer<typeof upsertProductReviewsSchema>;
export declare const defaultStoreProductReviewFields: string[];
export declare const allowedStoreProductReviewFields: string[];
export declare const defaultStoreReviewsQueryConfig: QueryConfig<ProductReview>;
export declare const storeProductReviewRoutesMiddlewares: MiddlewareRoute[];
