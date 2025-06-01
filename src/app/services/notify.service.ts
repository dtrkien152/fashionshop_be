import { injectable } from 'tsyringe';
import { NotifyFilter } from '../dto';
import { PageableUtils } from '../utils';
import { Op } from 'sequelize';
import { Notify, Otp } from '../models';
import moment from 'moment/moment';

@injectable()
class NotifyService {
  constructor() {
  }

  async getAllNotify(filter: NotifyFilter) {
    const pageRequest = PageableUtils.pageRequest(filter.page, filter.limit, filter.orderBy, filter.orderDirection);
    const whereCondition = {
      [Op.and]: [],
    };
    if (filter.type) {
      whereCondition[Op.and].push({
        type: filter.type,
      });
    }
    const { rows, count } = await Notify.findAndCountAll({
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      where: whereCondition[Op.and].length ? whereCondition : undefined,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows, count);
  }

  async checkNewNotify(lastChecked: Date) {
    const count = await Notify.count({
      where: {
        createdAt: {
          [Op.gt]: lastChecked,
        },
      },
    });
    return count > 0;
  };
}

export default NotifyService;