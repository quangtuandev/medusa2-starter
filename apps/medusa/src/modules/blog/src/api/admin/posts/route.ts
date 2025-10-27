import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { BLOG_MODULE } from '../../../';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

const updatePostSchema = createPostSchema.partial();

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const filters = {
    status: req.query.status as string,
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

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const validatedData = createPostSchema.parse(req.body);
  const post = await blogModuleService.createPost(validatedData);
  res.status(201).json(post);
}