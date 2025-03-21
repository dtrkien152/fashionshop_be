import { inject, injectable } from 'tsyringe';
import CategoryService from '../services/category.service';
import { Category } from '../models';
import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';
import { PostService } from '../services';

@injectable()
class PostController {
  constructor(@inject(PostService) private postService: PostService) {
  }

  getTop5LastestPost = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.postService.getTopPostLastest(5);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  getTop8LastestPost = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.postService.getTopPostLastest(8);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getByCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;

      if (isNaN(categoryId) || categoryId <= 0) {
        return res.status(400).json({ message: 'Invalid categoryId' });
      }

      const result = await this.postService.getPostsByCategory({ categoryId, page, size });

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };


  getAllcategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.postService.getAllCategoriesWithPostCount();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getPostDetailByCode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code } = req.params;
      if (!code) {
        return res.status(400).json({ message: 'Code is required' });
      }

      const postDetail = await this.postService.getPostDetailByCode(code);

      if (!postDetail) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.json(postDetail);
    } catch (error) {
      next(error);
    }
  };


}

export default PostController;
