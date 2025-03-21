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
    if (isActive !== null) {
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
      limit: parseInt(limit), // Đảm bảo limit là số
      offset: parseInt(String(offset)), // Đảm bảo offset là số
      subQuery: false,
    });

    return {
      total: result.count.length,
      data: result.rows,
    };
  }
  async createCategory(data: any) {
    return await Category.create(data);
  }

  // Cập nhật danh mục
  async updateCategory(id: number, data: any) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Danh mục không tồn tại');

    await category.update(data);
    return category;
  }
}

export default CategoryService;
