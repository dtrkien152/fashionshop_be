import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { FileService, ProductService } from '../services';
import { IProductFilterParams } from '../dto/product.dto';

@injectable()
class ProductController {
  constructor(@inject(ProductService) private productService: ProductService,
              @inject(FileService) private fileService: FileService
  ) {
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

  searchProductsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const model = req.body as IProductFilterParams;
      const result = await this.productService.searchProductsForAdmin(model);
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

  getRecommendedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { productId } = req.query;

      const result = await this.productService.getRecommendedProducts({
        productId: Number(productId),
      });

      res.json(result);
    } catch (error) {
      console.error('Get recommended products error:', error);
      next(error);
    }
  };


  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const { status } = req.body;
      const result = await this.productService.updateStatus(productId, status);
      res.json(result);
    } catch (error) {
      console.error('Get recommended products error:', error);
      next(error);
    }
  };

  createProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: { productName, categoryId, price, description, thumbnailUrl, imageUrls, subProducts } = req.body;

      // if (!payload.thumbnailUrl || !Array.isArray(payload.imageUrls) || payload.imageUrls.length === 0) {
      //   return res.status(400).json({ error: 'Thumbnail URL and image URLs are required' });
      // }
      // Lưu sản phẩm vào database
      const result=await this.productService.createProduct(payload);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productId = parseInt(req.params.id, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
      }

      const product = await this.productService.getProductByIdAdmin(productId);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  };
  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let updateData = req.body;
      const productId = Number(updateData.productId);

      if (!productId) {
        res.status(400).json({ message: 'Thiếu ID sản phẩm' });
        return;
      }

      // Xử lý file upload
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files.thumbnail) {
          const file = files.thumbnail[0];
          const thumbnailUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, file.originalname);
          updateData.thumbnailUrl = thumbnailUrl;
        }

        if (files.images) {
          const imageUrls = await Promise.all(
            files.images.map((file) => this.fileService.uploadFileToAzure(file.buffer, file.mimetype, file.originalname))
          );
          updateData.imageUrls = imageUrls;
        }
      }

      // Cập nhật sản phẩm
      const updatedProduct = await this.productService.updateProduct(productId, updateData);

      // ✅ **KHÔNG return res.json(), chỉ gọi res.json()**
      res.json({ message: 'Cập nhật sản phẩm thành công', product: updatedProduct });

    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm', error: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        return res.status(400).json({ message: 'Thiếu ID sản phẩm' });
      }

      const result = await this.productService.deleteProductById(productId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  countProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
     const result=await this.productService.countProducts();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };


}

export default ProductController;
