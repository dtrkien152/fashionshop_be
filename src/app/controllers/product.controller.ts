// src/controllers/product.controller.ts

import { Request, Response } from 'express';
import {inject, injectable, singleton} from 'tsyringe';
import { ProductService } from '../services';
import { IProductFilterParams } from '../dto/product.dto';
import UserController from "./user.controller";

@injectable()
class ProductController {
  constructor(@inject(ProductService) private productService: ProductService) {}

   searchProducts=async (req: Request, res: Response): Promise<any>=> {
    try {
      const model = req.query as IProductFilterParams;
      const result = await this.productService.searchProducts(model);
      res.json(result);
    } catch (error) {
      console.error('Search Products Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProductController;
