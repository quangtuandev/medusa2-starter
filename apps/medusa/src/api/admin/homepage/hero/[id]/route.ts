import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { HOMEPAGE_MODULE } from '../../../../../modules/homepage';

/** Removes one slide of the hero carousel. */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const service: any = req.scope.resolve(HOMEPAGE_MODULE);
  const id = req.params.id as string;

  const [slide] = await service.listHeroBanners({ id });

  if (!slide) {
    return res.status(404).json({ type: 'not_found', message: 'Hero slide not found' });
  }

  await service.deleteHeroBanners(id);

  res.json({ id, deleted: true });
};
