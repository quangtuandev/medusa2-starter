import { z } from 'zod';
export type PostStorePaypalPaymentType = z.infer<typeof PostStorePaypalPayment>;
export declare const PostStorePaypalPayment: z.ZodObject<{
    session_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    session_id: string;
}, {
    session_id: string;
}>;
