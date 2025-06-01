import { injectable } from 'tsyringe';
import { SORT_BY_ENUM } from '../constants';
import { Op } from 'sequelize';
import { User } from '../models';

interface SearchParams {
  keyword?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: SORT_BY_ENUM;
}


@injectable()
class AdminUserService {
  constructor() {
  }

   async searchUsers({ keyword, isActive, page = 1, limit = 10, sortBy = SORT_BY_ENUM.NEWEST }: SearchParams) {
    const whereCondition: any = {
      role: ['STAFF', 'SALE'],
    };

    // Lọc theo từ khóa (họ tên, email, số điện thoại)
    if (keyword) {
      whereCondition[Op.or] = [
        { fullName: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // Lọc theo trạng thái hoạt động
    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    // Tính toán phân trang
    const offset = (Number(page) - 1) * Number(limit);

    // Sắp xếp theo thời gian tạo
    let orderCondition;
    switch (sortBy) {
      case SORT_BY_ENUM.NEWEST:
        orderCondition = [['createdAt', 'DESC']];
        break;
      case SORT_BY_ENUM.LATEST:
        orderCondition = [['createdAt', 'ASC']];
        break;
      default:
        orderCondition = [['createdAt', 'DESC']];
    }

    // Query danh sách user
    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'fullName', 'email', 'phone', 'role', 'isActive', 'createdAt'],
      order: orderCondition,
      limit: Number(limit),
      offset: Number(offset),
      subQuery: false,
    });

    return {
      total: count,
      data: rows,
    };
  }
}