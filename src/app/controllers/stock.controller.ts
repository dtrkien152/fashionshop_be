import { inject, injectable } from 'tsyringe';
import { StockService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { HistoryStockFilter, StockFilter } from '../dto';

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

  getHistoryStock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const filterParams = req.query as HistoryStockFilter;
      const results = await this.stockService.getAllHistoryStock(filterParams);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  upsertStock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload = req.body;
      const { email } = req.session;
      const result = await this.stockService.upsertStock(payload, email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default StockController;