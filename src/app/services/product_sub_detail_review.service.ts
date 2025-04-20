import { injectable } from 'tsyringe';
import { OrderProductReview } from '../dto';
import { IProductSubDetailReview, Order, ProductSubDetail, ProductSubDetailReview } from '../models';
import { PageableUtils } from '../utils';

@injectable()
class ProductSubDetailReviewService {
  constructor() {
  }

  async searchByProductId(productId: number, page: number, limit: number) {
    const pageRequest = PageableUtils.pageRequest(page, limit);
    const { rows, count } = await ProductSubDetailReview.findAndCountAll({
      include: [
        {
          model: ProductSubDetail,
          required: true,
          where: {
            productId: productId,
          },
          attributes: [],
        },
        {
          model: Order,
          attributes: ['customerName'],
        },
      ],
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
    });
    return PageableUtils.pageResponse(page, pageRequest.limit, rows.map(this.map2Dto), count);
  }

  map2Dto(review: ProductSubDetailReview) {
    return {
      id: review.id,
      orderId: review.orderId,
      productSubDetailId: review.productSubDetailId,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      customerName: review.order.customerName,
    };
  }

  async createReview(payload: OrderProductReview) {
    return ProductSubDetailReview.create(payload);
  }

  async editReview(payload: IProductSubDetailReview) {
    return ProductSubDetailReview.update({
      rating: payload.rating,
      comment: payload.comment,
    }, { where: { id: payload.id } });
  }
}

export default ProductSubDetailReviewService;