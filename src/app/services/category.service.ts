import { injectable } from 'tsyringe';
import { Category, Product } from '../models';
import { col, fn, Op } from 'sequelize';

@injectable()
class CategoryService {
  constructor() {
  }

  async getAllCategories() {
    return Category.findAll({
      attributes: ['id', 'code', 'name', 'thumbnailUrl', 'isActive'],
      where: { isActive: true },
    });
  }

  // Lấy danh sách danh mục + số lượng sản phẩm trong danh mục
  async searchForAdmin({ keyword, isActive, page = 1, limit = 10 }: any) {
    const whereCondition: any = {};

    // Tìm kiếm theo tên danh mục hoặc mã danh mục
    if (keyword && keyword.trim() !== '') {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { code: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // Lọc theo trạng thái danh mục
    if (isActive != null && isActive != 'null') {
      whereCondition.isActive = isActive === 'true';
    }

    // Phân trang
    const offset = (page - 1) * limit;

    const result = await Category.findAndCountAll({
      where: whereCondition,
      attributes: [
        'id',
        'name',
        'description',
        'thumbnailUrl',
        'isActive',
        [fn('COUNT', col('products.id')), 'productCount'],
      ],
      include: [
        {
          model: Product,
          as: 'products',
          attributes: [], // Không lấy dữ liệu Product
        },
      ],
      group: ['Category.id'],
      limit: parseInt(limit),
      offset: parseInt(String(offset)),
      order: [['createdAt', 'DESC']],
      subQuery: false,
    });

    return {
      total: result.count.length,
      data: result.rows,
    };
  }

  async createCategory(data: { name: string; description?: string; isActive?: boolean; thumbnailUrl?: string }) {
    return await Category.create(data);
  }

  // Cập nhật danh mục
  async updateCategory(payload: {
    categoryId: number;
    name?: string;
    description?: string;
    isActive?: boolean;
    thumbnailUrl?: string
  }) {
    const category = await Category.findByPk(payload.categoryId);
    if (!category) throw new Error('Danh mục không tồn tại');

    return await category.update({
      name: payload.name || category.name,
      description: payload.description || category.description,
      isActive: payload.isActive !== undefined ? payload.isActive : category.isActive,
      thumbnailUrl: payload.thumbnailUrl || category.thumbnailUrl,
    });
  }

  async getCategoryById(categoryId: number) {
    return await Category.findOne({
      rejectOnEmpty: undefined,
      where: { id: categoryId },
      attributes: ['id', 'name', 'description', 'thumbnailUrl', 'isActive'],
    });
  };
}

export default CategoryService;
