import { inject, injectable } from 'tsyringe';
import { StockService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { StockFilter } from '../dto';

@injectable()
class StockController {

  constructor(@inject(StockService) private stockService: StockService) {
  }

  getAllStock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const filterParams = req.query as StockFilter;
      const results = await this.stockService.getAll(filterParams);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  upsertStock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload = req.body;
      const result = await this.stockService.upsertStock(payload);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default StockController;