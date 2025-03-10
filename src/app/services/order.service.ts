import { delay, inject, injectable } from 'tsyringe';
import { OrderCreateRequest } from '../dto/order.dto';
import { ProductService, ShipFeeService, UserService, VoucherService } from './index';
import { IOrder, IOrderDetail, Order, OrderDetail } from '../models';
import { GenerateUtils } from '../utils';
import { ORDER_STATUS } from '../constants';
import { BadRequestError } from '../errors';

@injectable()
class OrderService {
  constructor(@inject(delay(() => UserService)) private userService: UserService,
              @inject(delay(() => ProductService)) private productService: ProductService,
              @inject(delay(() => VoucherService)) private voucherService: VoucherService,
              @inject(delay(() => ShipFeeService)) private shipFeeService: ShipFeeService) {
  }

  create = async (payload: OrderCreateRequest) => {
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
      const user = await this.userService.getByEmail(payload.email);
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
      email: payload.email,
      voucherCode: payload.voucherCode,
      shipFee: shipFee,
      customerName: payload.customer.name,
      customerAddress: payload.customer.address,
      customerPhone: payload.customer.phone,
      totalPrice: originTotalPrice - discountPrice,
      paymentType: payload.payment.type,
      paymentStatus: payload.payment.status,
      status: ORDER_STATUS.PENDING,
    };
    await Order.create(order);
    const orderDetails = await Promise.all(payload.products.map(async (el) => {
      const subProduct = await this.productService.getSubProductByProductIdAndColorAndSize(el.productId, el.color, el.size);
      el.productSubDetailId = subProduct.id;
      return {
        orderId: order.id,
        productSubDetailId: subProduct.id,
        unit: el.unit,
        totalPrice: el.unit * el.priceInUnit,
      } as IOrderDetail;
    }));
    await OrderDetail.create(orderDetails);
    return {
      order, orderDetails: payload.products,
    };
  };
}

export default OrderService;