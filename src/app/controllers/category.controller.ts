import { inject, injectable } from 'tsyringe';
import { FileService, ProductService } from '../services';
import CategoryService from '../services/category.service';
import { Category } from '../models';
import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';

@injectable()
class CategoryController {
  constructor(@inject(CategoryService) private categoryService: CategoryService,
              @inject(FileService) private fileService: FileService) {
  }

  getAllCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await this.categoryService.getAllCategories();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  searchCategoriesForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { keyword, isActive, page = 1, limit = 10 } = req.body;

      // Chuyển đổi kiểu dữ liệu
      const filters = {
        keyword: keyword ? String(keyword) : undefined,
        isActive: isActive !== undefined ? String(isActive) : undefined,
        page: Number(page),
        limit: Number(limit),
      };

      const categories = await this.categoryService.searchForAdmin(filters);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      console.log('📥 Received body:', req.body);
      console.log('📸 Received file:', req.file);

      const { name, description, isActive } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Tên danh mục không được để trống!' });
      }

      let thumbnailUrl = null;
      const file = req.file;
      if (file) {
        const fileName = `category-${Date.now()}.jpg`;
        thumbnailUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, fileName);
      }

      // Tạo mới danh mục
      const newCategory = await this.categoryService.createCategory({
        name,
        description,
        isActive: isActive === 'true',
        thumbnailUrl,
      });

      return res.status(200).json({ message: 'Tạo danh mục thành công', data: newCategory });
    } catch (error) {
      console.error('❌ Lỗi khi tạo danh mục:', error);
      next(error)
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { categoryId } = req.params;

      const category = await this.categoryService.getCategoryById(Number(categoryId));
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { categoryId, name, description, isActive } = req.body;

      if (!categoryId) {
        return res.status(400).json({ message: 'Thiếu ID danh mục' });
      }
      let thumbnailUrl = null;
      const file = req.file; // File ảnh từ request
      if (file) {
        // Upload ảnh lên Azure và lấy URL
        thumbnailUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, `${categoryId}-${Date.now()}.jpg`);
      }

      const updatedCategory = await this.categoryService.updateCategory({
        categoryId,
        name,
        description,
        isActive,
        thumbnailUrl,
      });

      return res.json({ message: 'Cập nhật danh mục thành công', data: updatedCategory });
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  };

}

export default CategoryController;
