import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import BlogModuleService from '../../../service';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const blogService: BlogModuleService = req.scope.resolve('blogModuleService');
    const result = await blogService.getPublishedPosts({
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