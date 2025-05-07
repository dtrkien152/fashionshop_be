import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { ShipFeeService, VoucherService } from '../services';
import { ShipFeeCreateRequest, ShipFeeUpdateRequest } from '../dto';
import { SORT_BY_ENUM } from '../constants';

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

  deleteShipFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }

      const results = await this.shipFeeService.deleteShipFee(id);
      return res.status(200).json({ message: 'Xóa phí ship thành công' });
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

  searchFeeByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { keyword, page, limit, sortBy } = req.body;
      const sortOption = Object.values(SORT_BY_ENUM).includes(sortBy as SORT_BY_ENUM)
        ? (sortBy as SORT_BY_ENUM)
        : SORT_BY_ENUM.NEWEST;
      const results = await this.shipFeeService.searchShipFeeByAdmin(
        {
          keyword,
          page: Number(page),
          limit: Number(limit),
          sortBy: sortOption,
        },
      );
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id,status } = req.body;
      await this.shipFeeService.updateStatus({id:id,status:status})
      return res.status(200).json("Success");
    } catch (error) {
      next(error);
    }
  };

  createFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await this.shipFeeService.createShipFee(req.body)
      return res.status(200).json("Success");
    } catch (error) {
      next(error);
    }
  };
  updateFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await this.shipFeeService.updateShipFee(req.body)
      return res.status(200).json("Success");
    } catch (error) {
      next(error);
    }
  };
}

export default ShipFeeController;
