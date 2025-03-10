import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { ProductService } from '../services';
import { IProductFilterParams } from '../dto/product.dto';
import UserController from "./user.controller";

@injectable()
class ProductController {
  constructor(@inject(ProductService) private productService: ProductService) {}

  searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const model = req.query as IProductFilterParams;
      const result = await this.productService.searchProducts(model);
      res.json(result);
    } catch (error) {
      console.error('Search Products Error:', error);
      next(error);
    }
  }

    getProductDetail=async (req: Request, res: Response, next: NextFunction): Promise<any>=> {
        try {
            const productId = req.query.productId;
            const result = await this.productService.getProductDetail(Number(productId));
            res.json(result);
        } catch (error) {
            console.error('Search Products Error:', error);
           next(error);
        }
    }

}

export default ProductController;
