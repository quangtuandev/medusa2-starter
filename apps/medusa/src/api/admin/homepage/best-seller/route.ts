import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { HOMEPAGE_MODULE } from '../../../../modules/homepage';
import { BestSellerWorkflowInput, upsertBestSellerWorkflow } from '../../../../workflows/upsert-homepage';
import { bestSellerSchema } from '../validators';

const pickCurrent = async (service: any) => {
  const [active] = await service.listBestSellerSections(
    { is_active: true },
    { take: 1, order: { created_at: 'DESC' } },
  );
  if (active) return active;

  const [latest] = await service.listBestSellerSections({}, { take: 1, order: { created_at: 'DESC' } });
  return latest ?? null;
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service: any = req.scope.resolve(HOMEPAGE_MODULE);
  const best_seller = await pickCurrent(service);

  res.json({ best_seller });
};

const upsert = async (req: MedusaRequest, res: MedusaResponse) => {
  const parsed = bestSellerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      type: 'invalid_data',
      message: 'Invalid best seller payload',
      errors: parsed.error.flatten(),
    });
  }

  const input = parsed.data;
  const headingEn = input.heading_en || input.heading;

  if (!headingEn) {
    return res.status(400).json({
      type: 'invalid_data',
      message: 'heading_en (or heading) is required',
    });
  }

  const payload: BestSellerWorkflowInput = {
    id: input.id,
    is_active: input.is_active,
    heading_en: headingEn,
    heading_vi: input.heading_vi || input.heading || headingEn,
    description_en: input.description_en ?? input.description ?? null,
    description_vi: input.description_vi ?? input.description ?? null,
    items: input.items,
  };

  const { result } = await upsertBestSellerWorkflow(req.scope).run({
    input: payload,
  });

  res.json({ best_seller: result });
};

export const POST = upsert;
export const PUT = upsert;
