import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { FileService, PostService } from '../services';
import { UnauthorizedError } from '../errors';
import { SORT_BY_ENUM } from '../constants';

@injectable()
class PostController {
  constructor(@inject(PostService) private postService: PostService,
              @inject(FileService) private fileService: FileService) {
  }

  getTop5LastestPost = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.postService.getTopPostLastest(5);
      res.status(200).json(result);
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
      const { categoryId, keyword = '', page = 1, size = 10 } = req.body;

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

      return res.status(200).json(postDetail);
    } catch (error) {
      next(error);
    }
  };
  // ✅ API thêm bình luận
  addComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { postId, content } = req.body;
      const { userId } = req.session;
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      if (!postId || !content.trim()) {
        return res.status(400).json({ message: 'Thiếu thông tin bình luận' });
      }
      const comment = await this.postService.addComment(postId, userId, content);
      return res.json(comment);
    } catch (error) {
      next(error);
    }
  };

  searchByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { keyword, categoryId, page, limit, sortBy } = req.body;
      const sortOption = Object.values(SORT_BY_ENUM).includes(sortBy as SORT_BY_ENUM)
        ? (sortBy as SORT_BY_ENUM)
        : SORT_BY_ENUM.NEWEST;

      const result = await this.postService.searchByAdmin({
        keyword,
        categoryId,
        page: Number(page),
        limit: Number(limit),
        sortBy: sortOption,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updatePostStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { postId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Invalid isActive value' });
      }

      const result = await this.postService.updatePostStatus(Number(postId), isActive);
      res.json({ message: 'Status updated successfully', data: result });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let updateData = req.body;
      const postId = updateData.postId; // 🛠 Lấy postId từ params
      if (!postId) {
        res.status(400).json({ message: 'Thiếu ID bài viết' });
        return;
      }


      // Chuyển đổi dữ liệu
      updateData.categoryId = updateData.categoryId ? Number(updateData.categoryId) : null;
      updateData.isActive = updateData.status === 'active'; // 🛠 Chuyển đổi status

      // Xử lý file upload
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.thumbnail) {
          const file = files.thumbnail[0];
          const thumbnailUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, file.originalname);
          updateData.thumbnailUrl = thumbnailUrl;
        }
      }

      // Cập nhật bài viết
      const updatedPost = await this.postService.updatePost(Number(postId), updateData);

      res.json({ message: 'Cập nhật bài viết thành công', post: updatedPost });
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật bài viết', error: error.message });
    }
  };

  getRecommendTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const keyword = req.query.keyword as string | undefined;
      const result = await this.postService.getRecommendTag(keyword);
      res.json(result);
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật bài viết', error: error.message });
    }
  };
  createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let postData = req.body;

      // ✅ Xử lý file upload (thumbnail)
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.thumbnail) {
          const file = files.thumbnail[0];
          postData.thumbnailUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, file.originalname);
        }
      }

      // ✅ Kiểm tra `categoryId`
      const postCategoryId = parseInt(postData.categoryId, 10);
      if (isNaN(postCategoryId)) {
        res.status(400).json({ message: 'Danh mục không hợp lệ' });
      }


      // ✅ Chuyển `content` thành chuỗi JSON nếu cần
      postData.content = typeof postData.content === 'object'
        ? JSON.stringify(postData.content)
        : postData.content;

      // ✅ Xử lý `tags`
      postData.tags = typeof postData.tags === 'string'
        ? JSON.parse(postData.tags)
        : postData.tags || [];

      // ✅ Tạo bài viết
      const newPost = await this.postService.createPost(postData);

      res.status(201).json({ message: 'Tạo bài viết thành công', post: newPost });
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo bài viết', error: error.message });
    }
  };

  getPostDetailByADMIN = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { postId } = req.query;
      if (!postId) {
        res.status(400).json({ message: 'Thiếu ID bài viết' });
        return;
      }
      const postData = await this.postService.getPostDetailByADMIN(Number(postId));
      res.json({ message: 'Lấy chi tiết bài viết thành công', data: postData });
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài viết:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết bài viết', error: error.message });
    }
  };
}

export default PostController;
