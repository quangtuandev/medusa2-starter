import { type MiddlewareRoute } from '@medusajs/framework';
import { z } from 'zod';
export declare const listStoreProductReviewStatsQuerySchema: z.ZodObject<{
    fields: z.ZodOptional<z.ZodString>;
} & {
    offset: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    limit: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodNumber>>, number, unknown>;
    order: z.ZodOptional<z.ZodString> | z.ZodDefault<z.ZodOptional<z.ZodString>>;
    with_deleted: z.ZodEffects<z.ZodOptional<z.ZodBoolean>, boolean | undefined, unknown>;
} & {
    id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    product_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    average_rating: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodArray<z.ZodNumber, "many">]>>;
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
    id?: string | string[] | undefined;
    product_id?: string | string[] | undefined;
    created_at?: any;
    updated_at?: any;
    fields?: string | undefined;
    order?: string | undefined;
    with_deleted?: boolean | undefined;
    average_rating?: number | number[] | undefined;
}, {
    offset?: unknown;
    limit?: unknown;
    id?: string | string[] | undefined;
    product_id?: string | string[] | undefined;
    created_at?: any;
    updated_at?: any;
    fields?: string | undefined;
    order?: string | undefined;
    with_deleted?: unknown;
    average_rating?: number | number[] | undefined;
}>;
export declare const defaultStoreProductReviewStatFields: string[];
export declare const defaultStoreProductReviewStatsQueryConfig: {
    defaults: string[];
    defaultLimit: number;
    isList: boolean;
};
export declare const storeProductReviewStatRoutesMiddlewares: MiddlewareRoute[];
