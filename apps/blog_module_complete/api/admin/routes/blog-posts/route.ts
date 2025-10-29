import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import BlogModuleService from '../../../../service';

export const POST = async (req: MedusaRequest<{ title: string; content: string; slug?: string; thumbnail?: string; published?: boolean }>, res: MedusaResponse) => {
  try {
    const { title, content, slug, thumbnail, published } = req.body;
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');
    const post = await blogService.createPost({ title, content, slug, thumbnail, published });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');
    const result = await blogService.getPosts({
      published: req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined,
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};