import { type MiddlewareRoute } from '@medusajs/framework';
import { z } from 'zod';
export declare const updateProductReviewStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "approved", "flagged"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "flagged";
}, {
    status: "pending" | "approved" | "flagged";
}>;
export type UpdateProductReviewStatusSchema = z.infer<typeof updateProductReviewStatusSchema>;
export declare const adminProductReviewStatusRoutesMiddlewares: MiddlewareRoute[];
