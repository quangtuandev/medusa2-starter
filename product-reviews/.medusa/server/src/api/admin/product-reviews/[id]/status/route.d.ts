import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import type { UpdateProductReviewStatusSchema } from './middlewares';
export declare const PUT: (req: AuthenticatedMedusaRequest<UpdateProductReviewStatusSchema>, res: MedusaResponse) => Promise<void>;
