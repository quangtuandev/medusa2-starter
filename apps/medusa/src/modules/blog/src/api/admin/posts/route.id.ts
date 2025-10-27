import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { BLOG_MODULE } from '../../../../src';

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const post = await blogModuleService.getPostById(req.params.id);
  res.json(post);
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const validatedData = req.body; // Add schema validation if needed
  const post = await blogModuleService.updatePost(req.params.id, validatedData);
  res.json(post);
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const result = await blogModuleService.deletePost(req.params.id);
  res.json(result);
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);

  const result = await blogModuleService.incrementPostViews(req.params.id);
  res.json(result);
}