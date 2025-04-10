import { inject, injectable } from 'tsyringe';
import { SORT_BY_ENUM } from '../constants';
import { Op } from 'sequelize';
import { Employee, Site } from '../models';
import bcrypt from 'bcryptjs';
import { NotFoundError } from '../errors';
import { FileService, MailService } from './index';

interface SearchParams {
  keyword?: string;
  siteId?: number;
  page?: number;
  limit?: number;
  role?: string;
  sortBy?: SORT_BY_ENUM;
}

const ALLOWED_ROLES = ['STAFF', 'SALE', 'ADMIN'];

@injectable()
class EmployeeService {
  constructor(
    @inject(FileService) private fileService: FileService,
    @inject(MailService) private mailService: MailService
  ) {}

  async searchByAdmin({
                        keyword,
                        siteId,
                        page = 1,
                        limit = 10,
                        role,
                        sortBy = SORT_BY_ENUM.NEWEST,
                      }: SearchParams) {
    const whereCondition: any = {};
    if (role&&role!="all") {
      whereCondition.role = role;
    } else {
      // Nếu không có role, mặc định chỉ lấy STAFF và SALE
      whereCondition.role = { [Op.in]: ['STAFF', 'SALE'] };
    }
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
        },
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

  async getByUsername(username: string) {
    return await Employee.findOne({ where: { username } });
  }

  async createEmployee(data: any, fileBuffer?: Buffer, mimeType?: string, fileName?: string) {
    const mailService = new MailService();

    // Tạo mật khẩu random
    const plainPassword = mailService.generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Upload avatar nếu có
    let avatarUrl: string | null = null;
    if (fileBuffer && mimeType && fileName) {
      avatarUrl = await this.fileService.uploadFileToAzure(fileBuffer, mimeType, fileName);
    }

    const newEmployee = await Employee.create({
      ...data,
      password: hashedPassword,
      avatar: avatarUrl,
      isActive: true,
    });

    // Gửi email với mật khẩu đã tạo
    await mailService.sendNewEmployeeAccount(data.username, plainPassword, data.fullName);

    return newEmployee;
  }
}

export default EmployeeService;
