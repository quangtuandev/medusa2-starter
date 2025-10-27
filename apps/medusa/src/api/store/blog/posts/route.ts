import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
const BLOG_MODULE = 'blogModuleService';

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const filters = {
    status: req.query.status as string || 'published',
    category_id: req.query.category_id as string,
    search: req.query.search as string,
  };

  const pagination = {
    limit: parseInt(req.query.limit as string) || 20,
    offset: parseInt(req.query.offset as string) || 0,
  };

  const result = await blogModuleService.getPosts(filters, pagination);
  res.json(result);
}