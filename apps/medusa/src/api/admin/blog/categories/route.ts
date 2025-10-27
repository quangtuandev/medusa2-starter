import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
const BLOG_MODULE = 'blogModuleService';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  featured_image: z.string().optional(),
  is_active: z.boolean().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const filters = {
    is_active: req.query.is_active === 'true',
  };

  const pagination = {
    limit: parseInt(req.query.limit as string) || 20,
    offset: parseInt(req.query.offset as string) || 0,
  };

  const result = await blogModuleService.getCategories(filters, pagination);
  res.json(result);
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const validatedData = createCategorySchema.parse(req.body);
  const category = await blogModuleService.createCategory(validatedData);
  res.status(201).json(category);
}