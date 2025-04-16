import { inject, injectable } from 'tsyringe';
import { SORT_BY_ENUM } from '../constants';
import { Op } from 'sequelize';
import { Employee, Site } from '../models';
import bcrypt from 'bcryptjs';
import { NotFoundError } from '../errors';
import { FileService, MailService } from './index';
import { GenerateUtils } from '../utils';

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
    @inject(MailService) private mailService: MailService,
  ) {
  }

  async searchByAdmin({
                        keyword,
                        siteId,
                        page = 1,
                        limit = 10,
                        role,
                        sortBy = SORT_BY_ENUM.NEWEST,
                      }: SearchParams) {
    const whereCondition: any = {};
    if (role && role != 'all') {
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
      attributes: ['id', 'code', 'email', 'fullName', 'role', 'isActive', 'createdAt', 'avatar'],
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
      rejectOnEmpty: undefined,
      where: { id },
      include: [
        {
          model: Site,
          attributes: ['id', 'name'], // Ví dụ: name = 'Miền Bắc', 'Miền Nam'
        },
      ],
      attributes: {
        exclude: ['password'], // Không trả về mật khẩu
      }
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

  async getByEmail(email: string) {
    return await Employee.findOne({ where: { email: email } });
  }

  async getById(id: number): Promise<Employee> {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new NotFoundError('User không tồn tại!');
    }
    return employee;
  }

  async createEmployee(data: any, fileBuffer?: Buffer, mimeType?: string, fileName?: string) {
    const mailService = new MailService();
    const email = data.email;
    const siteId = data.siteId ? Number(data.siteId) : null;

    // ✅ Kiểm tra username/email đã tồn tại
    const existingEmployee = await Employee.findOne({ rejectOnEmpty: undefined, where: { email: email } });
    if (existingEmployee) {
      throw new Error('Email đã tồn tại, vui lòng dùng email khác');
    }

    // Tạo mật khẩu ngẫu nhiên
    const plainPassword = mailService.generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Upload avatar nếu có
    // let avatarUrl: string | null = null;
    // if (fileBuffer && mimeType && fileName) {
    //   avatarUrl = await this.fileService.uploadFileToAzure(fileBuffer, mimeType, fileName);
    // }

    // Tạo employee
    const newEmployee = await Employee.create({
      ...data,
      code: GenerateUtils.code('EMP'),
      email: email,
      phone: data.phoneNumber,
      password: hashedPassword,
      isActive: true,
      siteId: data.siteId ?? null,
      avatar: data.avatar,
    });

    // Gửi mail tài khoản
    await mailService.sendNewEmployeeAccount(data.email, plainPassword, data.fullName);

    return newEmployee;
  }

  async updateEmployee(id: number, data: any, fileBuffer?: Buffer, mimeType?: string, fileName?: string) {
    // Tìm nhân viên theo ID
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error('Nhân viên không tồn tại');
    }

    // Kiểm tra nếu cập nhật email trùng với người khác
    if (data.email && data.email !== employee.email) {
      const existed = await Employee.findOne({ rejectOnEmpty: undefined, where: { email: data.email } });
      if (existed && existed.id !== id) {
        throw new Error('Email đã tồn tại, vui lòng dùng email khác');
      }
    }

    // Upload avatar nếu có
    let avatarUrl = employee.avatar;
    if (fileBuffer && mimeType && fileName) {
      avatarUrl = await this.fileService.uploadFileToAzure(fileBuffer, mimeType, fileName);
    }

    const updatedEmployee = await employee.update({
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      gender: data.gender == 1,
      dob: data.birthday ? new Date(data.birthday) : null,
      siteId: data.siteId ? Number(data.siteId) : null,
      isActive: data.isActive,
      phone: data.phoneNumber,
      avatar: avatarUrl,
    });

    return updatedEmployee;
  };

   updateProfile = async (employeeId: number, payload: Partial<Employee>) => {
    const employee = await Employee.findByPk(employeeId);

    if (!employee) throw new Error('Không tìm thấy nhân viên');

    await employee.update({
      fullName: payload.fullName,
      dob: payload.dob,
      gender: payload.gender,
      phone: payload.phone,
      address: payload.address,
    });

    return employee;
  };

  async uploadAvatar(userId: number, fileBuffer: Buffer, mimeType: string): Promise<string> {
    // Kiểm tra xem user có tồn tại không
    const user = await Employee.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }

    // Upload avatar lên Azure
    const fileName = `avatar-${userId}-${Date.now()}.jpg`; // Tên file theo ID user
    const avatar = await this.fileService.uploadFileToAzure(fileBuffer, mimeType, fileName);

    // Cập nhật URL avatar vào database
    await user.update({ avatar });

    return avatar; // Trả về URL avatar mới
  }
}

export default EmployeeService;
