import { inject, injectable } from 'tsyringe';
import { EmployeeService, FileService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { SORT_BY_ENUM } from '../constants';

@injectable()
class EmployeeController {

  constructor(@inject(EmployeeService) private employeeService: EmployeeService,
              @inject(FileService) private fileService: FileService) {
  }


  search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const {
        keyword = '',
        siteId,
        page = 1,
        limit = 10,
        sortBy = 'NEWEST',
        role
      } = req.body.params;
      const result = await this.employeeService.searchByAdmin({
        keyword: keyword as string,
        siteId: siteId ? Number(siteId) : undefined,
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as SORT_BY_ENUM,
        role,
      });

      res.status(200).json({
        message: 'Lấy danh sách nhân viên thành công',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRoleSite = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id, role, siteId } = req.body;

      if (!id || !role || !siteId) {
        return res.status(400).json({ message: 'Thiếu thông tin id, role hoặc siteId' });
      }

      const result = await this.employeeService.updateRoleAndSite(+id, role, +siteId);
      res.status(200).json({ message: 'Cập nhật role và site thành công', data: result });
    } catch (error) {
      next(error);
    }
  };

  getDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getDetail(+id);

      if (!employee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }

      res.status(200).json({ message: 'Lấy thông tin nhân viên thành công', data: employee });
    } catch (error) {
      next(error);
    }
  };
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id, isActive } = req.body;

      if (!id || typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Thiếu id hoặc isActive' });
      }

      const result = await this.employeeService.updateStatus(id, isActive);
      return res.json({ message: 'Cập nhật trạng thái thành công', employee: result });
    } catch (error) {
      next(error);
    }
  };
  async createEmployee(req: Request, res: Response) {
    try {
      const data = req.body;

      // Convert kiểu dữ liệu
      const gender = data.gender === 'true' || data.gender === true;
      const dob = data.birthday ? new Date(data.birthday) : null;
      const siteId = data.siteId ? Number(data.siteId) : null;

      let avatarUrl = null;
      if (req.files && (req.files as any).avatar) {
        const file = (req.files as any).avatar[0];
        avatarUrl = await this.fileService.uploadFileToAzure(file.buffer, file.mimetype, file.originalname);
      }

      const newEmployee = await this.employeeService.createEmployee({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
        gender,
        dob,
        siteId,
        avatar: avatarUrl,
        isActive: true,
      });

      res.json({ message: 'Tạo mới nhân viên thành công', employee: newEmployee });
    } catch (error: any) {
      console.error('Lỗi tạo mới employee:', error);
      res.status(500).json({ message: 'Tạo employee thất bại', error: error.message });
    }
  }
}

export default EmployeeController;
