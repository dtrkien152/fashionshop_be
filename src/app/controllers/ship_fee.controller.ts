import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { ShipFeeService, VoucherService } from '../services';
import { ShipFeeCreateRequest, ShipFeeUpdateRequest } from '../dto';

@injectable()
class ShipFeeController {

  constructor(@inject(ShipFeeService) private shipFeeService: ShipFeeService) {
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: ShipFeeCreateRequest = req.body;
      const results = await this.shipFeeService.create(payload);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: ShipFeeUpdateRequest = req.body;
      const results = await this.shipFeeService.update(payload);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const results = await this.shipFeeService.deactivate(+id);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const shipFees = await this.shipFeeService.getAll();
      return res.status(200).json(shipFees);
    } catch (error) {
      next(error);
    }
  };

  getFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { price } = req.query;
      const results = await this.shipFeeService.getFee(+price);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

}

export default ShipFeeController;
