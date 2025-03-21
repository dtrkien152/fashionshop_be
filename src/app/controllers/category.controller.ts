import { inject, injectable } from 'tsyringe';
import { ProductService } from '../services';
import CategoryService from '../services/category.service';
import { Category } from '../models';
import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/category.service';

@injectable()
class CategoryController {
  constructor(@inject(CategoryService) private categoryService: CategoryService) {
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
      const category = await this.categoryService.createCategory(req.body);
      res.json(category);;
    } catch (error) {
      next(error);
    }
  };
  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const updatedCategory = await this.categoryService.updateCategory(Number(id), req.body);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  };

}

export default CategoryController;
