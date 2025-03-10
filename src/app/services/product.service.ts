// src/services/product.service.ts
import { Op, Order as SequelizeOrder, WhereOptions } from 'sequelize';

import { Category, IProduct, Order, OrderDetail, Product, ProductSubDetail, Stock } from '../models';
import { injectable } from 'tsyringe';
import {
  IProductDetailResponse,
  IProductFilterParams,
  IProductItemResponse,
} from '../dto/product.dto';
import { SORT_BY_ENUM } from '../constants';
import { Sequelize } from 'sequelize-typescript';

@injectable()
class ProductService {
  constructor() {}

  async searchProducts({
    keyword,
    categoryId,
    sortBy = SORT_BY_ENUM.NEWEST,
    limit = 10,
    page = 1,
  }: IProductFilterParams): Promise<{ data: IProductItemResponse[]; total: number }> {
    const where: WhereOptions<IProduct> = {};
    const offset = (page - 1) * limit;

    // Tìm kiếm theo từ khóa
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { code: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    // Lọc theo category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Sắp xếp
    const order: SequelizeOrder = [];
    switch (sortBy) {
      case 'price_asc':
        order.push(['salePrice', 'ASC']);
        break;
      case 'price_desc':
        order.push(['salePrice', 'DESC']);
        break;
      case 'newest':
        order.push(['createdAt', 'DESC']);
        break;
      case 'latest':
        order.push(['createdAt', 'ASC']);
        break;
      default:
        order.push(['createdAt', 'DESC']);
        break;
    }

    // Truy vấn dữ liệu và ánh xạ về IProductItemResponse
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ['name'] },
        { model: ProductSubDetail, attributes: ['size', 'color', 'isActive'] },
      ],
      order,
      limit: Number(limit),
      offset,
    });

    const data: IProductItemResponse[] = rows.map((product) => {
      const colors = [
        ...new Set(product.ProductSubDetails.map((sub) => sub.color).filter(Boolean)),
      ];
      const sizes = [...new Set(product.ProductSubDetails.map((sub) => sub.size).filter(Boolean))];
      const firstSubImage =
        product.imageUrls?.[1] || product.imageUrls?.[0] || product.thumbnailUrl;
      const discountPercentage = Math.round(
        ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
      );

      return {
        id: product.id,
        category: product.Category?.name || 'Unknown',
        productName: product.name || 'No name',
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        flag: {
          type: 'sale',
          value: `${discountPercentage}% Sale`,
        },
        images: [product.thumbnailUrl, firstSubImage],
        colors,
        size: sizes,
      };
    });

    return { data, total: count };
  }

  async getProductDetail(productId: number) {
    const where: WhereOptions<IProduct> = { id: productId };

    const product: Product = await Product.findOne({
      where,
      attributes: ['id', 'name'],
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: ProductSubDetail,
          attributes: ['id', 'size', 'color', 'isActive'],
          include: [
            {
              model: Stock,
              attributes: ['unit'],
            },
          ],
        },
      ],
    });

    if (!product) return null;

    // Xử lý dữ liệu trả về theo interface IProductDetailResponse
    const response: IProductDetailResponse = {
      product_id: product.id,
      productName: product.name,
      category_id: product.Category?.id || 0,
      category_name: product.Category?.name || '',
      productSubDetails: product.ProductSubDetails.map((subDetail) => ({
        id: subDetail.id,
        size: subDetail.size,
        color: subDetail.color,
        isActive: subDetail.isActive,
        totalQuantity: subDetail.Stocks?.reduce((total, stock) => total + stock.unit, 0) || 0,
      })),
    };

    return response;
  }

  getProductById(id: number) {
    return Product.findByPk(id);
  }

  getSubProductByProductIdAndColorAndSize = (productId: number, color: string, size: string) => {
    return ProductSubDetail.findOne({ where: { productId, color, size } });
  };


   async  getTopSellingProducts({
                                                keyword,
                                                categoryId,
                                                sortBy = 'unit_on_order',
                                                limit = 10,
                                                page = 1,
                                              }: {
    keyword?: string;
    categoryId?: number;
    sortBy?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: IProductItemResponse[]; total: number }> {
    const where: WhereOptions = {};
    const offset = (page - 1) * limit;

    // Tìm kiếm theo từ khóa
    if (keyword) {
      where[Op.or as any] = [
        { name: { [Op.iLike as any]: `%${keyword}%` } },
        { code: { [Op.iLike as any]: `%${keyword}%` } },
      ];
    }

    // Lọc theo category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Sắp xếp mặc định theo unit_on_order (sản phẩm bán chạy nhất)
    const order: any[] = [['unit_on_order', 'DESC']];
    switch (sortBy) {
      case 'price_asc':
        order.unshift(['salePrice', 'ASC']);
        break;
      case 'price_desc':
        order.unshift(['salePrice', 'DESC']);
        break;
      case 'newest':
        order.unshift(['createdAt', 'DESC']);
        break;
      case 'latest':
        order.unshift(['createdAt', 'ASC']);
        break;
      default:
        order.unshift(['unit_on_order', 'DESC']);
        break;
    }

    // Truy vấn dữ liệu và ánh xạ về IProductItemResponse
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ['name'] },
        { model: ProductSubDetail, attributes: ['size', 'color', 'isActive'] },
      ],
      order,
      limit: Number(limit),
      offset,
    });

    const data: IProductItemResponse[] = rows.map((product) => {
      const colors = [
        ...new Set(product.ProductSubDetails.map((sub) => sub.color).filter(Boolean)),
      ];
      const sizes = [...new Set(product.ProductSubDetails.map((sub) => sub.size).filter(Boolean))];
      const firstSubImage =
        product.imageUrls?.[1] || product.imageUrls?.[0] || product.thumbnailUrl;
      const discountPercentage = Math.round(
        ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
      );

      return {
        id: product.id,
        category: product.Category?.name || 'Unknown',
        productName: product.name || 'No name',
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        flag: {
          type: 'sale',
          value: `${discountPercentage}% Sale`,
        },
        images: [product.thumbnailUrl, firstSubImage],
        colors,
        size: sizes,
      };
    });

    return { data, total: count };
  }
}

export default ProductService;
