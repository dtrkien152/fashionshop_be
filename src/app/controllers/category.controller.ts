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
}

export default CategoryController;
