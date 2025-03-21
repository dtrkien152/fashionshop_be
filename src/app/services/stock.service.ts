import { injectable } from 'tsyringe';
import { Stock } from '../models';
import { NotFoundError } from '../errors';

@injectable()
class StockService {
  constructor() {
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

}

export default StockService;