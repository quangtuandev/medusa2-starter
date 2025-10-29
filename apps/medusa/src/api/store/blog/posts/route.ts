import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
const BLOG_MODULE = 'blogModuleService';

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const filters = {
    published: req.query.published ? req.query.published === 'true' : true,
    limit: parseInt(req.query.limit as string) || 20,
    offset: parseInt(req.query.offset as string) || 0,
  };

  const result = await blogModuleService.getPublishedPosts({
    limit: filters.limit,
    offset: filters.offset
  });
  res.json(result);
}