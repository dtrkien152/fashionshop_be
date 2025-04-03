import { inject, injectable } from 'tsyringe';
import { SiteService } from '../services';
import { NextFunction, Request, Response } from 'express';

@injectable()
class SiteController {

  constructor(@inject(SiteService) private siteService: SiteService) {
  }

  getAllSite = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const results = await this.siteService.getAll();
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default SiteController;