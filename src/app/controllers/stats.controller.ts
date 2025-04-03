import { inject, injectable } from 'tsyringe';
import { StatsService } from '../services';
import { NextFunction, Request, Response } from 'express';

@injectable()
class StatsController {
  constructor(@inject(StatsService) private statsService: StatsService) {
  }

  getRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      let { type } = req.query;
      const results = await this.statsService.getRevenueStats(type as string);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      let { type } = req.query;
      const results = await this.statsService.getTopSellingProducts(type as string);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;