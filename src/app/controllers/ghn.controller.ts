import { inject, injectable } from 'tsyringe';
import { AuthService, GhnService, MailService, OtpService, UserService } from '../services';
import { NextFunction, Request, Response } from 'express';
import EmployeeController from './employee.controller';

@injectable()
class GHNController {
  constructor(@inject(GhnService) private ghnService: GhnService) {

  }

  getProvince = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const results = await this.ghnService.getProvince();
      if (!results.data.data || !results.data.data.length) {
        res.json([]);
      }
      const dataValid = results.data.data.filter(el => ![2002, 298, 290, 286].includes(el.ProvinceID));
      res.json(dataValid);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getDistrict = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { provinceId } = req.query;
      const results = await this.ghnService.getDistrict(Number(provinceId));
      if (!results.data.data || !results.data.data.length) {
        res.json([]);
      }
      res.json(results.data.data);
    } catch (error) {
      next(error);
    }
  };

  getWard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { districtId } = req.query;
      const results = await this.ghnService.getWard(Number(districtId));
      if (!results.data.data || !results.data.data.length) {
        res.json([]);
      }
      res.json(results.data.data);
    } catch (error) {
      next(error);
    }
  };
}

export default GHNController;
