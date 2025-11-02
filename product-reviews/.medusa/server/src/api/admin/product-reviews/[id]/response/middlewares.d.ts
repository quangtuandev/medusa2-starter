import { z } from 'zod';
import { MiddlewareRoute } from '@medusajs/framework';
export declare const createProductReviewResponseDTO: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type CreateProductReviewResponseDTO = z.infer<typeof createProductReviewResponseDTO>;
export declare const adminProductReviewResponseRouteMiddlewares: MiddlewareRoute[];
