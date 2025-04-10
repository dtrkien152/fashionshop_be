import { injectable } from 'tsyringe';
import { Order, OrderDetail, Product, ProductSubDetail, Site, Stock } from '../models';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestError } from '../errors';
import { differenceInDays, endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { StatsFilter } from '../dto';


@injectable()
class StatsService {
  constructor() {
  }

  async getStatsInMonth(siteId?: string) {
    const whereCondition = {
      [Op.and]: [],
    };
    if (siteId) {
      whereCondition[Op.and].push({
        siteId: +siteId,
      });
    }
    // Xác định thời gian tháng hiện tại và tháng trước
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Truy vấn doanh thu & đơn hàng của tháng hiện tại
    const currentMonthStats = await Order.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalOrders'],
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue'],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.literal(`CASE WHEN status = 'RETURN' THEN 1 END`),
          ),
          'totalReturnOrders',
        ],
      ],
      where: {
        ...whereCondition,
        createdAt: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth],
        },
      },
      raw: true,
    });

    // Truy vấn doanh thu & đơn hàng của tháng trước
    const lastMonthStats = await Order.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalOrders'],
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue'],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.literal(`CASE WHEN status = 'RETURN' THEN 1 END`),
          ),
          'totalReturnOrders',
        ],
      ],
      where: {
        ...whereCondition,
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth],
        },
      },
      raw: true,
    });

    // Lấy dữ liệu từ query
    const current: any = currentMonthStats[0] || { totalOrders: 0, totalRevenue: 0, totalReturnOrders: 0 };
    const last: any = lastMonthStats[0] || { totalOrders: 0, totalRevenue: 0, totalReturnOrders: 0 };

    // Tính phần trăm tăng trưởng (tránh chia cho 0)
    const calculateGrowth = (currentValue: number, lastValue: number) => {
      if (lastValue === 0) return currentValue > 0 ? 100 : 0;
      return ((currentValue - lastValue) / lastValue) * 100;
    };
    return {
      totalRevenue: {
        current: current.totalRevenue,
        lastMonth: last.totalRevenue,
        growth: calculateGrowth(current.totalRevenue, last.totalRevenue),
      },
      totalOrders: {
        current: current.totalOrders,
        lastMonth: last.totalOrders,
        growth: calculateGrowth(current.totalOrders, last.totalOrders),
      },
      totalReturnOrders: {
        current: current.totalReturnOrders,
        lastMonth: last.totalReturnOrders,
        growth: calculateGrowth(current.totalReturnOrders, last.totalReturnOrders),
      },
    };
  }

  async getRevenueStats(filter: StatsFilter) {
    if (!filter.startAt || !filter.endAt || filter.startAt > filter.endAt) {
      throw new BadRequestError('Invalid date range');
    }

    const daysDiff = differenceInDays(filter.endAt, filter.startAt);
    let dateFormat: string;
    const whereCondition = {
      [Op.and]: [],
    };
    let siteIdWhereCondition: any = {
      [Op.and]: [],
    };
    let periodType = 'DAY';
    const xField: string[] = [];
    const weekLabel = new Map<string, string>();

    if (daysDiff <= 7) {
      // Tìm kiếm theo ngày
      dateFormat = '%Y-%m-%d';
      let currentDate = new Date(filter.startAt);

      while (currentDate <= filter.endAt) {
        xField.push(format(currentDate, 'yyyy-MM-dd')); // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
      periodType = 'DAY';
    } else if (daysDiff <= 31) {
      // Tìm kiếm theo tuần
      dateFormat = '%Y-%u';
      let currentWeekStart = startOfWeek(filter.startAt, { weekStartsOn: 1 }); // Bắt đầu từ thứ 2
      let currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

      while (currentWeekStart <= filter.endAt) {
        xField.push(`${format(currentWeekStart, 'yyyy')}-${getISOWeek(currentWeekStart)}`);
        weekLabel.set(`${format(currentWeekStart, 'yyyy')}-${getISOWeek(currentWeekStart)}`, `${format(currentWeekStart, 'yyyy-MM-dd')}->${format(currentWeekEnd, 'yyyy-MM-dd')}`);
        currentWeekStart = new Date(currentWeekEnd);
        currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
        currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      }
      periodType = 'WEEK';
    } else if (daysDiff <= 365) {
      // Tìm kiếm theo tháng
      dateFormat = '%Y-%m';
      let currentMonth = new Date(filter.startAt);

      while (currentMonth <= filter.endAt) {
        xField.push(format(currentMonth, 'yyyy-MM'));
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
      periodType = 'MONTH';
    } else {
      // Tìm kiếm theo năm
      dateFormat = '%Y';
      let currentYear = filter.startAt.getFullYear();
      const endYear = filter.endAt.getFullYear();

      while (currentYear <= endYear) {
        xField.push(currentYear.toString());
        currentYear++;
      }
      periodType = 'YEAR';
    }

    whereCondition[Op.and].push({
      createdAt: {
        [Op.between]: [filter.startAt, filter.endAt],
      },
    });

    if (filter.siteId) {
      whereCondition[Op.and].push({
        siteId: +filter.siteId,
      });
      siteIdWhereCondition[Op.and].push({
        id: +filter.siteId,
      });
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
    const sites = await Site.findAll({ where: siteIdWhereCondition, attributes: ['id', 'name'] });
    // 🔹 Ghép dữ liệu vào `xField`, nếu thiếu thì thêm `totalRevenue = 0`
    const revenueMap = new Map(revenueStats.map((item: any) => [`${item.siteId}-${item.timePeriod}`, item.totalRevenue]));

    return sites.map(site => {
      return xField.map(period => ({
        siteId: site.id,
        siteName: site.name,
        timePeriod: periodType === 'WEEK' ? weekLabel.get(period) : period,
        totalRevenue: +revenueMap.get(`${site.id}-${period}`) || 0,
      }));
    }).flat();
  }

  async getTopSellingProducts(filter: StatsFilter) {
    if (!filter.startAt || !filter.endAt || filter.startAt > filter.endAt) {
      throw new BadRequestError('Invalid date range');
    }
    const whereCondition = {
      [Op.and]: [],
    };
    whereCondition[Op.and].push({
      createdAt: {
        [Op.between]: [filter.startAt, filter.endAt],
      },
    });
    // Tổng số lượng sản phẩm đã bán
    const totalSoldData: any = await OrderDetail.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('unit')), 'totalSold']],
      include: [
        {
          model: Order,
          attributes: [],
          where: whereCondition,
        },
      ],
      raw: true,
    });

    if (filter.siteId) {
      whereCondition[Op.and].push({
        siteId: +filter.siteId,
      });
    }

    const totalSold = totalSoldData[0]?.totalSold || 0;

    // Lấy top 10 sản phẩm bán chạy nhất theo Product
    const topProducts = await OrderDetail.findAll({
      attributes: [
        [Sequelize.col('productSubDetail.Product.id'), 'productId'],
        [Sequelize.fn('SUM', Sequelize.col('unit')), 'totalSold'],
        [Sequelize.col('productSubDetail.Product.name'), 'productName'],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: whereCondition,
        },
        {
          model: ProductSubDetail,
          attributes: [],
          include: [
            {
              model: Product,
              attributes: [],
            },
          ],
        },
      ],
      group: ['productSubDetail.Product.id', 'productSubDetail.Product.name'],
      order: [[Sequelize.literal('totalSold'), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Tổng số lượng của top 10 sản phẩm
    const topSoldTotal = topProducts.reduce((sum, product: any) => sum + +product.totalSold, 0);

    // Tính phần còn lại (Other)
    const otherSold = totalSold - topSoldTotal;

    // Chuyển đổi dữ liệu sang định dạng Pie Chart
    const chartData = topProducts.map((product: any) => ({
      productName: product.productName,
      totalSold: product.totalSold,
      rate: +((product.totalSold / totalSold) * 100).toFixed(2),
    }));

    // Thêm "Other" nếu có phần còn lại
    if (otherSold > 0) {
      chartData.push({
        productName: 'Other',
        totalSold: otherSold,
        rate: +(100 - chartData.reduce((acc, cur) => acc + cur.rate, 0)).toFixed(2),
      });
    }
    return chartData;
  }

  async getTopStockProduct(siteId?: string) {
    const whereCondition = {
      [Op.and]: [],
    };
    if (siteId) {
      whereCondition[Op.and].push({
        siteId: +siteId,
      });
    }
    // Lấy tổng số lượng tồn kho của tất cả sản phẩm
    const totalStock: any = await Stock.findAll({
      where: whereCondition,
      attributes: [[Sequelize.fn('SUM', Sequelize.col('unit')), 'total']],
      raw: true,
    });

    const totalStockValue = totalStock[0]?.total || 0;

    // Lấy top 10 sản phẩm có số lượng tồn kho nhiều nhất (gộp theo Product)
    const topStocks = await Stock.findAll({
      where: whereCondition,
      attributes: [
        [Sequelize.col('productSubDetail.Product.id'), 'productId'],
        [Sequelize.fn('SUM', Sequelize.col('unit')), 'totalStock'],
        [Sequelize.col('productSubDetail.Product.name'), 'productName'],
      ],
      include: [
        {
          model: ProductSubDetail,
          attributes: [],
          include: [
            {
              model: Product,
              attributes: [],
            },
          ],
        },
      ],
      group: ['productSubDetail.Product.id', 'productSubDetail.Product.name'],
      order: [[Sequelize.literal('totalStock'), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Tính tổng số lượng của top 10 sản phẩm
    const topStockTotal = topStocks.reduce((sum, stock: any) => sum + +stock.totalStock, 0);

    // Tính phần còn lại (Other)
    const otherStock = totalStockValue - topStockTotal;

    // Chuyển đổi dữ liệu về dạng phù hợp cho Pie Chart
    const chartData = topStocks.map((stock: any) => ({
      productName: stock.productName,
      totalStock: stock.totalStock,
      rate: +((stock.totalStock / totalStockValue) * 100).toFixed(2),
    }));

    // Thêm "Other" nếu có phần còn lại
    if (otherStock > 0) {
      chartData.push({
        productName: 'Other',
        totalStock: otherStock,
        rate: +(100 - chartData.reduce((acc, cur) => acc + cur.rate, 0)).toFixed(2),
      });
    }
    return chartData;
  }
}

export default StatsService;