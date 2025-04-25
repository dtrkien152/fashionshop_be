import { injectable } from 'tsyringe';
import { OrderProductReview } from '../dto';
import { IProductSubDetailReview, Order, ProductSubDetail, ProductSubDetailReview, User } from '../models';
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
          attributes: ['customerName', 'email'],
        },
      ],
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
    });

    const mappedRows = await Promise.all(
      rows.map(async (item) => {
        const email = item.order?.email;
        let avatar = null;

        if (email) {
          const user = await User.findOne({
            where: { email },
            attributes: ['avatar'],
          });

          if (user?.avatar) {
            avatar = user.avatar;
          }
        }

        return this.map2Dto(item, avatar);
      })
    );

    return PageableUtils.pageResponse(page, pageRequest.limit,mappedRows, count);
  }

  map2Dto(review: ProductSubDetailReview,avatar) {
    return {
      id: review.id,
      orderId: review.orderId,
      productSubDetailId: review.productSubDetailId,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      customerName: review.order.customerName,
      email: review.order.email,
      avatar:avatar||null
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