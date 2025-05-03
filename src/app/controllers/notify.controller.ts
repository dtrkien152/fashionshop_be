import { inject, injectable } from 'tsyringe';
import { NotifyService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { NotifyFilter } from '../dto';
import moment from 'moment';

@injectable()
class NotifyController {
  constructor(@inject(NotifyService) private notifyService: NotifyService) {
  }

  getAllNotify = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const filterParams = req.query as NotifyFilter;
      const results = await this.notifyService.getAllNotify(filterParams);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  checkNewNotify = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const lastChecked = moment().utc().toDate();

      const maxWaitTime = 30000; // 30s
      const pollInterval = 2000; // 2s

      let waited = 0;

      const checkLoop = async () => {
        const hasNew = await this.notifyService.checkNewNotify(lastChecked);
        if (hasNew) {
          return res.json({ newNotify: true });
        }

        waited += pollInterval;
        if (waited >= maxWaitTime) {
          return res.json({ newNotify: false });
        }

        setTimeout(checkLoop, pollInterval);
      };

      checkLoop();
    } catch (error) {
      next(error);
    }
  };
}

export default NotifyController;