// src/services/product.service.ts
import { col, fn, Op, Order as SequelizeOrder, WhereOptions } from 'sequelize';

import { Category, IProduct, Order, OrderDetail, Product, ProductSubDetail, Stock } from '../models';
import { injectable } from 'tsyringe';
import { IProductDetailResponse, IProductFilterParams, IProductItemResponse } from '../dto/product.dto';
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
                       }: IProductFilterParams): Promise<{ data: IProductItemResponse[]; total: number; totalPages: number }> {
    const where: WhereOptions<IProduct> = {};
    const offset = Math.max(0, (page - 1) * limit);

    // Tìm kiếm theo từ khóa (Case-insensitive cho MySQL)
    if (keyword) {
      where[Op.or] = [
        Sequelize.where(fn('LOWER', col('Product.name')), Op.like, `%${keyword.toLowerCase()}%`),
        Sequelize.where(fn('LOWER', col('Product.code')), Op.like, `%${keyword.toLowerCase()}%`),
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
      distinct: true,
      logging: console.log, // In ra câu truy vấn SQL
    });

    const data: IProductItemResponse[] = rows.map((product) => {
      const colors = [
        ...new Set(product.ProductSubDetails.map((sub) => sub.color).filter(Boolean)),
      ];
      const sizes = [
        ...new Set(product.ProductSubDetails.map((sub) => sub.size).filter(Boolean)),
      ];
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

    const totalPages = Math.ceil(count / limit);

    return { data, total: count, totalPages };
  }
  async getProductDetail(productId: number) {
    const where: WhereOptions<IProduct> = { id: productId };

    const product: Product = await Product.findOne({
      where,
      attributes: ['id', 'name', 'description', 'thumbnailUrl', 'imageUrls', 'salePrice', 'originalPrice', 'unitOnOrder'],
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
      productId: product.id,
      productName: product.name,
      description: product.description,
      thumbnailUrl: product.thumbnailUrl,
      imageUrls: product.imageUrls,
      unitOnOrder: product.unitOnOrder,
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
      categoryId: product.Category?.id || 0,
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

  async getTopSellingProducts({
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

  /**
   * Lấy ra tối đa 5 sản phẩm dựa vào category hoặc sản phẩm gần đây
   * @param productId ID của sản phẩm hiện tại
   * @returns Danh sách tối đa 5 sản phẩm
   */
  /**
   * Lấy ra tối đa 5 sản phẩm dựa vào category hoặc sản phẩm gần đây
   * @param productId ID của sản phẩm hiện tại
   * @returns Danh sách tối đa 5 sản phẩm
   */
  async getRecommendedProducts({ productId }) {
    // Lấy sản phẩm hiện tại để xác định categoryId
    const currentProduct = await Product.findByPk(productId);
    if (!currentProduct) {
      throw new Error('Product not found');
    }

    const { categoryId } = currentProduct;

    // Lấy tối đa 5 sản phẩm cùng category, ngoại trừ sản phẩm hiện tại
    const categoryProducts = await Product.findAll({
      where: {
        categoryId,
        id: { [Op.ne]: productId },
      },
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    // Nếu chưa đủ 5 sản phẩm, lấy thêm các sản phẩm gần đây nhất
    if (categoryProducts.length < 5) {
      const additionalProducts = await Product.findAll({
        where: {
          id: {
            [Op.notIn]: [productId, ...categoryProducts.map((p) => p.id)],
          },
        },
        limit: 5 - categoryProducts.length,
        order: [['createdAt', 'DESC']],
      });

      categoryProducts.push(...additionalProducts);
    }

    return categoryProducts;
  }
}

export default ProductService;
