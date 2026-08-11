import { z } from 'zod';
export type PostStorePaypalPaymentType = z.infer<typeof PostStorePaypalPayment>;
export declare const PostStorePaypalPayment: z.ZodObject<{
    session_id: z.ZodString;
}, z.core.$strip>;
