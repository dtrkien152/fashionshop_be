import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { ProductService } from '../services';
import { IProductFilterParams } from '../dto/product.dto';

@injectable()
class ProductController {
  constructor(@inject(ProductService) private productService: ProductService) {
  }

  searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const model = req.body as IProductFilterParams;
      const result = await this.productService.searchProducts(model);
      res.json(result);
    } catch (error) {
      console.error('Search Products Error:', error);
      next(error);
    }
  };

  getProductDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productId = req.query.productId;
      const result = await this.productService.getProductDetail(Number(productId));
      res.json(result);
    } catch (error) {
      console.error('Search Products Error:', error);
      next(error);
    }
  };

  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { keyword, categoryId, sortBy, limit, page } = req.query;

      const result = await this.productService.getTopSellingProducts({
        keyword: keyword as string,
        categoryId: categoryId ? Number(categoryId) : undefined,
        sortBy: sortBy as string,
        limit: limit ? Number(limit) : 10,
        page: page ? Number(page) : 1,
      });

      res.json(result);
    } catch (error) {
      console.error('get top selling products error:', error);
      next(error);
    }
  };

}

export default ProductController;
