import { inject, injectable } from 'tsyringe';
import CategoryService from '../services/category.service';
import { Category, Post } from '../models';
import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';
import { PostService } from '../services';
import { UnauthorizedError } from '../errors';

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
      const { categoryId, keyword = "", page = 1, size = 10 } = req.body;

      if (categoryId !== null && (isNaN(categoryId) || categoryId <= 0)) {
        return res.status(400).json({ message: 'Invalid categoryId' });
      }

      const result = await this.postService.getPostsByCategory({ categoryId, keyword, page, size });

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
  // ✅ API thêm bình luận
   addComment=async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { postId, content } = req.body;
      const { userId } = req.session;
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      if (!postId || !content.trim()) {
        return res.status(400).json({ message: "Thiếu thông tin bình luận" });
      }
      const comment = await this.postService.addComment(postId, userId, content);
      return res.json(comment);
    } catch (error) {
      next(error);
    }
  }

}

export default PostController;
