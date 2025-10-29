import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import BlogModuleService from '../../../../service';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params;
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');

    const post = await blogService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
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

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params;
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');

    const post = await blogService.updatePost(id, req.body);

    if (!post) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params;
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');

    const deleted = await blogService.deletePost(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Post not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};