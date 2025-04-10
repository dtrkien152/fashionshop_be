import { inject, injectable } from 'tsyringe';
import { EmployeeService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { SORT_BY_ENUM } from '../constants';

@injectable()
class EmployeeController {
  constructor(@inject(EmployeeService) private employeeService: EmployeeService) {
  }


  search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const {
        keyword = '',
        siteId,
        page = 1,
        limit = 10,
        sortBy = 'NEWEST',
      } = req.body.params;
      console.log('query',req.body);
      const result = await this.employeeService.searchByAdmin({
        keyword: keyword as string,
        siteId: siteId ? Number(siteId) : undefined,
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as SORT_BY_ENUM,
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

}

export default EmployeeController;
