// src/services/product.service.ts

import { Op, Order, WhereOptions } from 'sequelize';
import { Category, IProduct, Product, ProductSubDetail, Stock } from '../models';
import { injectable } from 'tsyringe';
import {IProductDetailResponse, IProductFilterParams, IProductItemResponse} from '../dto/product.dto';
import { SORT_BY_ENUM } from '../constants';

@injectable()
class ProductService {
  constructor() {
  }

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
    const order: Order = [];
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
      const colors = [...new Set(product.ProductSubDetails.map((sub) => sub.color).filter(Boolean))];
      const sizes = [...new Set(product.ProductSubDetails.map((sub) => sub.size).filter(Boolean))];
      const firstSubImage = product.imageUrls?.[0] || '';
      const discountPercentage = Math.round(
          ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
      );

      return {
        id: product.id,
        category: product.Category?.name || 'Unknown',
        productName: product.name || 'No name',
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        flag: {
          type: 'sale',
          value: `${{discountPercentage}}% Sale`,
        },
        images: [product.thumbnailUrl, firstSubImage],
        colors,
        size: sizes,
      };
    });

    return { data, total: count };
  }

  // async searchProducts({
  //                        keyword,
  //                        categoryId,
  //                        sortBy = SORT_BY_ENUM.NEWEST,
  //                        limit = 10,
  //                        page = 1,
  //                      }: IProductFilterParams) {
  //   const where: WhereOptions<IProduct> = {};
  //   const offset = (page - 1) * limit;
  //
  //   // Tìm kiếm theo từ khóa
  //   if (keyword) {
  //     where[Op.or] = [
  //       { name: { [Op.iLike]: `%${keyword}%` } },
  //       { code: { [Op.iLike]: `%${keyword}%` } },
  //     ];
  //   }
  //
  //   // Lọc theo category
  //   if (categoryId) {
  //     where.categoryId = categoryId;
  //   }
  //
  //   // Sắp xếp
  //   const order: Order = [];
  //   switch (sortBy) {
  //     case SORT_BY_ENUM.PRICE_ASC:
  //       order.push(['salePrice', 'ASC']);
  //       break;
  //     case SORT_BY_ENUM.PRICE_DESC:
  //       order.push(['salePrice', 'DESC']);
  //       break;
  //     case SORT_BY_ENUM.NEWEST:
  //       order.push(['createdAt', 'DESC']);
  //       break;
  //     case SORT_BY_ENUM.LATEST:
  //       order.push(['createdAt', 'ASC']);
  //       break;
  //     default:
  //       order.push(['createdAt', 'DESC']);
  //       break;
  //   }
  //
  //   // Truy vấn dữ liệu
  //   const { rows, count } = await Product.findAndCountAll({
  //     where,
  //     include: [{ model: Category, attributes: ['name'] }],
  //     order,
  //     limit: Number(limit),
  //     offset,
  //   });
  //
  //   return { data: rows, total: count };
  // }

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
}

export default ProductService;
