import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { BLOG_MODULE } from '../../../../../modules/blog';

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);
  const { id } = req.params;

  const post = await blogModuleService.retrievePost(id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json(post);
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);
  const { id } = req.params;

  const post = await blogModuleService.updatePosts([{ id, ...(req.body as any) }]);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json(post);
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogModuleService: any = req.scope.resolve(BLOG_MODULE);
  const { id } = req.params;

  const success = await blogModuleService.deletePosts(id);
  if (!success) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.status(204).send();
}