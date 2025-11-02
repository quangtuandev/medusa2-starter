import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { UpsertProductReviewsSchema } from './middlewares';
export declare const GET: (req: AuthenticatedMedusaRequest, res: MedusaResponse) => Promise<void>;
export declare const POST: (req: AuthenticatedMedusaRequest<UpsertProductReviewsSchema>, res: MedusaResponse) => Promise<void>;
