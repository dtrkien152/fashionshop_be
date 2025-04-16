import { inject, injectable } from 'tsyringe';
import { StatsService } from '../services';
import { NextFunction, Request, Response } from 'express';

@injectable()
class StatsController {
  constructor(@inject(StatsService) private statsService: StatsService) {
  }

  getRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { startAt, endAt, siteId } = req.query;
      const filterParams = {
        startAt: new Date(+startAt),
        endAt: new Date(+endAt),
        siteId: siteId as string,
      };
      const results = await this.statsService.getRevenueStats(filterParams);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getTopSellingProducts = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { startAt, endAt, siteId } = req.query;
      const filterParams = {
        startAt: new Date(+startAt),
        endAt: new Date(+endAt),
        siteId: siteId as string,
      };
      const results = await this.statsService.getTopSellingProducts(filterParams);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getStatsInMonth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { siteId } = req.query;
      const results = await this.statsService.getStatsInMonth(siteId as string);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getTopStockProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { siteId } = req.query;
      const results = await this.statsService.getTopStockProduct(siteId as string);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default StatsController;