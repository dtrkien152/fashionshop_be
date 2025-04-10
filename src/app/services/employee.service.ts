import { injectable } from 'tsyringe';
import { SORT_BY_ENUM } from '../constants';
import { Op } from 'sequelize';
import { Employee, Site } from '../models';

interface SearchParams {
  keyword?: string;
  siteId?: number;
  page?: number;
  limit?: number;
  sortBy?: SORT_BY_ENUM;
}
const ALLOWED_ROLES = ['STAFF', 'SALE', 'ADMIN'];

@injectable()
class EmployeeService {
  constructor() {
  }

  async searchByAdmin({
                        keyword,
                        siteId,
                        page = 1,
                        limit = 10,
                        sortBy = SORT_BY_ENUM.NEWEST,
                      }: SearchParams) {
    const whereCondition: any = {
      role: { [Op.in]: ['STAFF', 'SALE'] },
    };
    console.log('keyword', keyword);
    if (keyword) {
      // Sử dụng `Op.iLike` nếu dùng PostgreSQL để hỗ trợ tìm kiếm không phân biệt chữ hoa/thường
      whereCondition.fullName = { [Op.like]: `%${keyword}%` };  // Nếu không phải PostgreSQL thì dùng `Op.like`
    }

    if (siteId) {
      whereCondition.siteId = siteId;
    }

    const offset = (Number(page) - 1) * Number(limit);

    let orderCondition;
    switch (sortBy) {
      case SORT_BY_ENUM.LATEST:
        orderCondition = [['createdAt', 'ASC']];
        break;
      case SORT_BY_ENUM.NEWEST:
      default:
        orderCondition = [['createdAt', 'DESC']];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'code', 'username', 'fullName', 'role', 'isActive', 'createdAt', 'avatar'],
      include: [{ model: Site, attributes: ['id', 'name'] }],
      order: orderCondition,
      limit: Number(limit),
      offset,
      subQuery: false,
    });

    return {
      total: count,
      data: rows,
    };
  }


  async updateRoleAndSite(id: number, role: string, siteId: number) {
    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error('Role không hợp lệ');
    }

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error('Không tìm thấy employee');
    }

    // Kiểm tra site có tồn tại không (tuỳ vào logic của bạn)
    const siteExists = await Site.findByPk(siteId);
    if (!siteExists) {
      throw new Error('Site không tồn tại');
    }

    employee.role = role;
    employee.siteId = siteId;
    await employee.save();

    return {
      id: employee.id,
      fullName: employee.fullName,
      role: employee.role,
      siteId: employee.siteId,
    };
  }

  async getDetail(id: number) {
    const employee = await Employee.findOne({
      where: { id },
      include: [
        {
          model: Site,
          attributes: ['id', 'name'], // Ví dụ: name = 'Miền Bắc', 'Miền Nam'
        }
      ],
      attributes: {
        exclude: ['password'], // Không trả về mật khẩu
      },
    });

    return employee;
  }

  async updateStatus(id: any, isActive: boolean) {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error('Không tìm thấy employee');
    }

    employee.isActive = isActive;
    await employee.save();

    return employee;
  }
}

export default EmployeeService;
