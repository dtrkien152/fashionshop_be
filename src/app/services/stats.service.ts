import { injectable } from 'tsyringe';
import { Order, OrderDetail } from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestError } from '../errors';
import { getISOWeek } from 'date-fns';


@injectable()
class StatsService {
  constructor() {
  }

  async getRevenueStats(type: 'day' | 'week' | 'month' | 'year' | string) {
    let dateFormat: string;
    let whereCondition: any = {};

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2 đầu tuần
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ nhật cuối tuần
    let xField: string[] = []; // Danh sách trục X

    switch (type) {
      case 'day': {
        dateFormat = '%Y-%m-%d'; // YYYY-MM-DD
        whereCondition.createdAt = {
          [Op.between]: [startOfWeek, endOfWeek], // Lọc theo tuần hiện tại
        };

        for (let i = 0; i < 7; i++) {
          let d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          if (d <= today) {
            xField.push(d.toISOString().split('T')[0]); // Định dạng YYYY-MM-DD
          }
        }
        break;
      }

      case 'week': {
        dateFormat = '%Y-%u'; // YYYY-WeekNumber
        whereCondition.createdAt = {
          [Op.gte]: new Date(today.getFullYear(), today.getMonth(), 1), // Đầu tháng
          [Op.lte]: new Date(today.getFullYear(), today.getMonth() + 1, 0), // Cuối tháng
        };

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = today < new Date(today.getFullYear(), today.getMonth() + 1, 0) ? today : new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const firstWeek = getISOWeek(firstDay) + 1;
        const lastWeek = getISOWeek(lastDay);

        for (let i = firstWeek; i <= lastWeek; i++) {
          xField.push(`${today.getFullYear()}-${i.toString().padStart(2, '0')}`);
        }
        break;
      }

      case 'month': {
        dateFormat = '%Y-%m'; // YYYY-MM
        whereCondition.createdAt = {
          [Op.gte]: new Date(today.getFullYear(), 0, 1), // Từ 1/1 đến 31/12 năm hiện tại
          [Op.lte]: today,
        };

        for (let i = 1; i <= today.getMonth() + 1; i++) {
          xField.push(`${today.getFullYear()}-${i.toString().padStart(2, '0')}`);
        }
        break;
      }

      case 'year': {
        dateFormat = '%Y'; // YYYY
        const startYear = today.getFullYear() - 4;
        for (let i = startYear; i <= today.getFullYear(); i++) {
          xField.push(i.toString());
        }
        break;
      }

      default:
        throw new BadRequestError('Unknown type ' + type);
    }


    const revenueStats = await Order.findAll({
      attributes: [
        'siteId',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat), 'timePeriod'],
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue'],
      ],
      where: whereCondition, // Lọc dữ liệu theo thời gian
      group: ['siteId', 'timePeriod'],
      order: [[Sequelize.literal('timePeriod'), 'ASC']],
      raw: true,
    });
    // 🔹 Ghép dữ liệu vào `xField`, nếu thiếu thì thêm `totalRevenue = 0`
    const revenueMap = new Map(revenueStats.map((item: any) => [item.timePeriod, item.totalRevenue]));

    const result = xField.map(period => ({
      timePeriod: period,
      totalRevenue: revenueMap.get(period) || 0,
    }));

    return { revenueStats: result, xField };
  }

  async getTopSellingProducts(type: 'day' | 'week' | 'month' | 'year' | string) {
    let dateFormat: string;
    let whereCondition: any = {};

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Thứ 2 đầu tuần
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ nhật cuối tuần
    let xField: string[] = []; // Danh sách trục X

    switch (type) {
      case 'day': {
        dateFormat = '%Y-%m-%d'; // YYYY-MM-DD
        whereCondition.createdAt = {
          [Op.between]: [startOfWeek, endOfWeek], // Lọc theo tuần hiện tại
        };

        for (let i = 0; i < 7; i++) {
          let d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          if (d <= today) {
            xField.push(d.toISOString().split('T')[0]); // Định dạng YYYY-MM-DD
          }
        }
        break;
      }

      case 'week': {
        dateFormat = '%Y-%u'; // YYYY-WeekNumber
        whereCondition.createdAt = {
          [Op.gte]: new Date(today.getFullYear(), today.getMonth(), 1), // Đầu tháng
          [Op.lte]: new Date(today.getFullYear(), today.getMonth() + 1, 0), // Cuối tháng
        };

        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = today < new Date(today.getFullYear(), today.getMonth() + 1, 0) ? today : new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const firstWeek = getISOWeek(firstDay) + 1;
        const lastWeek = getISOWeek(lastDay);

        for (let i = firstWeek; i <= lastWeek; i++) {
          xField.push(`${today.getFullYear()}-${i.toString().padStart(2, '0')}`);
        }
        break;
      }

      case 'month': {
        dateFormat = '%Y-%m'; // YYYY-MM
        whereCondition.createdAt = {
          [Op.gte]: new Date(today.getFullYear(), 0, 1), // Từ 1/1 đến 31/12 năm hiện tại
          [Op.lte]: today,
        };

        for (let i = 1; i <= today.getMonth() + 1; i++) {
          xField.push(`${today.getFullYear()}-${i.toString().padStart(2, '0')}`);
        }
        break;
      }

      case 'year': {
        dateFormat = '%Y'; // YYYY
        const startYear = today.getFullYear() - 4;
        for (let i = startYear; i <= today.getFullYear(); i++) {
          xField.push(i.toString());
        }
        break;
      }

      default:
        throw new BadRequestError('Unknown type ' + type);
    }

    const topProducts = await OrderDetail.findAll({
      attributes: [
        'productSubDetailId',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('order.created_at'), dateFormat), 'timePeriod'],
        [Sequelize.fn('SUM', Sequelize.col('unit')), 'totalSold'],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: whereCondition, // Lọc theo ngày/tuần/tháng/năm
        },
      ],
      group: ['productSubDetailId', 'timePeriod'],
      order: [[Sequelize.literal('totalSold'), 'DESC']],
      limit: 10, // Lấy 10 sản phẩm bán chạy nhất
      raw: true,
    });
    // 🔹 Ghép dữ liệu với `xField`, nếu thiếu thì thêm `totalSold = 0`
    const productMap = new Map(topProducts.map((item: any) => [`${item.productSubDetailId}-${item.timePeriod}`, item.totalSold]));
    const topProductIds = [...new Set(topProducts.map((item: any) => item.productSubDetailId))];

    const result = xField.map(period => {
      return topProductIds.map(id => ({
        productSubDetailId: id,
        timePeriod: period,
        totalSold: productMap.get(`${id}-${period}`) || 0,
      }));
    }).flat();

    return { topProducts: result, xField };
  }
}

export default StatsService;