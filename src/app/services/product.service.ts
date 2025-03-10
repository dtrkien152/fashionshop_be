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
        thumbnailUrl: product.thumbnailUrl,
        imageUrls: product.imageUrls,
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


  async getTop10BestSellingProducts(): Promise<Product[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Lấy top sản phẩm bán chạy nhất trong ngày
    const bestSellingToday = await Product.findAll({
      attributes: [
        'id',
        'name',
        'salePrice',
        'thumbnailUrl',
        [Sequelize.fn('SUM', Sequelize.col('OrderDetails.unit')), 'unitsSold'],
      ],
      include: [
        {
          model: ProductSubDetail,
          attributes: [],
          include: [
            {
              model: OrderDetail,
              as: 'OrderDetails', // Đặt alias chính xác
              attributes: [],
              include: [
                {
                  model: Order,
                  attributes: [],
                  where: {
                    createdAt: {
                      [Op.gte]: oneWeekAgo,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
      group: ['Product.id'],
      order: [[Sequelize.literal('unitsSold'), 'DESC']],
      limit: 10,
    });


    const productIds = bestSellingToday.map((p) => p.id);
    let remainingSlots = 10 - productIds.length;

    // Nếu chưa đủ 10 sản phẩm, lấy thêm theo số lượng order cao nhất mọi thời điểm
    if (remainingSlots > 0) {
      const bestSellingAllTime = await Product.findAll({
        attributes: [
          'id',
          'name',
          'salePrice',
          'thumbnailUrl',
          [Sequelize.fn('SUM', Sequelize.col('orderDetails.unit')), 'totalUnitsSold'],
        ],
        include: [
          {
            model: ProductSubDetail,
            attributes: [],
            include: [
              {
                model: OrderDetail,
                attributes: [],
                include: [
                  {
                    model: Order,
                    attributes: [],
                  },
                ],
              },
            ],
          },
        ],
        where: {
          id: {
            [Op.notIn]: productIds,
          },
        },
        group: ['Product.id'],
        order: [[Sequelize.literal('totalUnitsSold'), 'DESC']],
        limit: remainingSlots,
      });

      productIds.push(...bestSellingAllTime.map((p) => p.id));
      remainingSlots = 10 - productIds.length;

      bestSellingToday.push(...bestSellingAllTime);
    }

    // Nếu vẫn chưa đủ, lấy thêm sản phẩm mới nhất
    if (remainingSlots > 0) {
      const newestProducts = await Product.findAll({
        where: {
          id: {
            [Op.notIn]: productIds,
          },
          isActive: true,
        },
        order: [['updatedAt', 'DESC']],
        limit: remainingSlots,
      });

      bestSellingToday.push(...newestProducts);
    }

    return bestSellingToday;
  }

}

export default ProductService;
