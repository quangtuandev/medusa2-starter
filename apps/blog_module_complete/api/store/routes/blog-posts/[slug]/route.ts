import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import BlogModuleService from '../../../service';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { slug } = req.params;
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');

    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Blog post not found'
      });
    }

    if (!post.published) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Blog post not available'
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};