import { injectable } from 'tsyringe';
import { ISite, IStock, Product, ProductSubDetail, Site, Stock, StockHistory } from '../models';
import { NotFoundError } from '../errors';
import { HistoryStockFilter, StockFilter, StockProductDto } from '../dto';
import { PageableUtils } from '../utils';
import { col, fn, Op } from 'sequelize';
import { sequelize } from '../config';

@injectable()
class StockService {
  constructor() {
  }

  async getAll(filter: StockFilter) {
    const likeOp = `%${filter.searchTerm}%`;
    const pageRequest = PageableUtils.pageRequest(filter.page, filter.limit, filter.orderBy, filter.orderDirection);
    const whereCondition = {
      [Op.and]: [],
    };
    if (filter.searchTerm) {
      if (filter.searchBy) {
        whereCondition[Op.and].push({
          [filter.searchBy]: { [Op.like]: likeOp },
        });
      } else {
        whereCondition[Op.and].push({
          [Op.or]: [
            { name: { [Op.like]: likeOp } },
            { code: { [Op.like]: likeOp } },
          ],
        });
      }
    }
    const whereStockCondition = {
      [Op.and]: [],
    };
    if (filter.siteId) {
      whereStockCondition[Op.and].push({
        siteId: +filter.siteId,
      });
    }
    const { rows, count } = await Product.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'name', 'code', 'thumbnailUrl'],
      include: [{
        model: ProductSubDetail,
        attributes: ['id', 'color', 'size'],
        include: [
          {
            model: Stock,
            where: whereStockCondition,
            required: false,
            attributes: ['siteId', 'unit'],
          },
        ],
      }],
      // order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      distinct: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows.map(this.map2StockDto), count);
  }

  map2StockDto(product: Product) {
    return {
      productId: product.id,
      productName: product.name,
      thumbnailUrl: product.thumbnailUrl,
      code: product.code,
      unitInStock: product.ProductSubDetails.reduce((acc, cur) => {
        return acc + cur.Stocks.reduce((acc, cur) => acc + cur.unit, 0);
      }, 0),
      productSubDetails: product.ProductSubDetails.map((productSubDetail => ({
        productSubDetailId: productSubDetail.id,
        color: productSubDetail.color,
        size: productSubDetail.size,
        stocks: productSubDetail.Stocks,
        unitInStock: productSubDetail.Stocks.reduce((acc, cur) => acc + cur.unit, 0),
      }))),
    } as StockProductDto;
  }

  async getAllHistoryStock(filter: HistoryStockFilter) {
    const pageRequest = PageableUtils.pageRequest(filter.page, filter.limit, filter.orderBy, filter.orderDirection);
    const whereCondition = {
      [Op.and]: [],
    };
    if (filter.siteId) {
      whereCondition[Op.and].push({
        siteId: +filter.siteId,
      });
    }
    if (filter.productSubDetailId) {
      whereCondition[Op.and].push({
        productSubDetailId: +filter.productSubDetailId,
      });
    }
    const { rows, count } = await StockHistory.findAndCountAll({
      where: whereCondition,
      include: [{
        model: Site,
        attributes: ['id', 'name'],
      }],
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows.map(this.map2HistoryStockDto), count);
  }

  map2HistoryStockDto(stockHistory: StockHistory) {
    return {
      siteId: stockHistory.siteId,
      productSubDetail: stockHistory.productSubDetail,
      unit: stockHistory.unit,
      createdAt: stockHistory.createdAt,
      createdBy: stockHistory.createdBy,
      siteName: stockHistory.site.name,
    };
  }

  async getStockByProductSubDetailIdAndSiteId(productSubDetailId: number, siteId: number) {
    const stock = await Stock.findOne({
      where: {
        productSubDetailId, siteId,
      },
    });
    if (!stock) {
      throw new NotFoundError('Stock not found.');
    }
    return stock;
  }

  async upsertStock(payload: IStock, createdBy: string) {
    const t = await sequelize.transaction(); // Khởi tạo transaction
    let results;
    const stock = await Stock.findOne({
      where: {
        productSubDetailId: payload.productSubDetailId, siteId: payload.siteId,
      },
    });
    if (stock) {
      results = await stock.update({ unit: stock.unit + +payload.unit }, { transaction: t });
    } else {
      results = await Stock.upsert(payload, { transaction: t });
    }
    await StockHistory.create({
      siteId: payload.siteId,
      productSubDetailId: payload.productSubDetailId,
      unit: +payload.unit,
      createdBy,
    }, { transaction: t });
    await t.commit();
    return results;
  }

  async updateUnitInStock(productSubDetailId: number, siteId: number, unitChanged: number) {
    const stock = await this.getStockByProductSubDetailIdAndSiteId(productSubDetailId, siteId);
    return stock.update({ unit: stock.unit + unitChanged });
  }

}

export default StockService;