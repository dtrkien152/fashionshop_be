import { delay, inject, injectable } from 'tsyringe';
import { OrderCreateRequest, OrderFilter } from '../dto/order.dto';
import { ProductService, ShipFeeService, UserService, VoucherService } from './index';
import { IOrder, IOrderDetail, Order, OrderDetail } from '../models';
import { GenerateUtils, PageableUtils } from '../utils';
import { ORDER_STATUS } from '../constants';
import { BadRequestError } from '../errors';
import { Op } from 'sequelize';

@injectable()
class OrderService {
  constructor(@inject(delay(() => UserService)) private userService: UserService,
              @inject(delay(() => ProductService)) private productService: ProductService,
              @inject(delay(() => VoucherService)) private voucherService: VoucherService,
              @inject(delay(() => ShipFeeService)) private shipFeeService: ShipFeeService) {
  }

  create = async (email: string, payload: OrderCreateRequest) => {
    const products = await Promise.all(payload.products.map(async (el) => {
      const product = await this.productService.getProductById(el.productId);
      el.priceInUnit = product.salePrice;
      el.productName = product.name;
      return product;
    }));
    const originTotalPrice = products.reduce((acc, cur) => acc + cur.salePrice, 0);
    let discountPrice = 0;
    if (payload.voucherCode) {
      const voucher = await this.voucherService.getByCode(payload.voucherCode);
      const user = await this.userService.getByEmail(email);
      if (!user) throw new BadRequestError('Email is invalid');
      if (await this.voucherService.verifyVoucherUser(user.id, voucher.id)) {
        if (originTotalPrice > voucher.triggerPrice) {
          discountPrice = Math.min(originTotalPrice * (voucher.discountPercent / 100), voucher.maxDiscountPrice);
        }
      } else throw new BadRequestError('Voucher is invalid!');
    }
    const totalPrice = originTotalPrice - discountPrice;
    const shipFee = await this.shipFeeService.getFee(totalPrice);
    const order: IOrder = {
      siteId: payload.siteId,
      code: GenerateUtils.code('ORD'),
      email: email,
      voucherCode: payload.voucherCode,
      shipFee: shipFee.fee,
      customerName: payload.customer.name,
      customerAddress: payload.customer.address,
      customerPhone: payload.customer.phone,
      totalPrice: originTotalPrice - discountPrice,
      paymentType: payload.payment.type,
      paymentStatus: payload.payment.status,
      status: ORDER_STATUS.PENDING,
    };
    const orderCreated = await Order.create(order);
    const orderDetails = await Promise.all(payload.products.map(async (el) => {
      const subProduct = await this.productService.getSubProductByProductIdAndColorAndSize(el.productId, el.color, el.size);
      el.productSubDetailId = subProduct.id;
      return {
        orderId: orderCreated.id,
        productSubDetailId: subProduct.id,
        unit: el.unit,
        totalPrice: el.unit * el.priceInUnit,
      } as IOrderDetail;
    }));
    await OrderDetail.bulkCreate(orderDetails);
    return {
      order, orderDetails: payload.products,
    };
  };

  async updateStatusOrder(code: string, status: ORDER_STATUS) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    return await order.update({ status });
  }

  async getAll(filter?: OrderFilter) {
    const likeOp = `%${filter.keyword}%`;
    const pageRequest = PageableUtils.pageRequest(filter.page, filter.limit, filter.orderBy, filter.orderDirection);
    const whereCondition = {
      [Op.and]: [],
    };
    if (filter.keyword) {
      whereCondition[Op.and].push({
        [Op.or]: [
          { code: { [Op.like]: likeOp } },
          { customerName: { [Op.like]: likeOp } },
          { customerPhone: { [Op.like]: likeOp } },
        ],
      });
    }
    if (filter.status) {
      whereCondition[Op.and].push({
        status: filter.status,
      });
    }
    if (filter.paymentStatus) {
      whereCondition[Op.and].push({
        paymentStatus: filter.paymentStatus,
      });
    }
    if (filter.email) {
      whereCondition[Op.and].push({
        email: filter.email,
      });
    }
    return await Order.findAll({
      order: pageRequest.order,
      offset: pageRequest.offset,
      limit: pageRequest.limit,
      where: whereCondition[Op.and].length ? whereCondition : undefined,
      include: { model: OrderDetail },
    });
  }
}

export default OrderService;