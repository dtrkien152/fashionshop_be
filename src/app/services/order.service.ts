import { delay, inject, injectable } from 'tsyringe';
import { OrderCreateRequest, OrderDto, OrderFilter } from '../dto/order.dto';
import { CartService, ProductService, ShipFeeService, StockService, UserService, VoucherService } from './index';
import { IOrder, IOrderDetail, Order, OrderDetail, Product, ProductSubDetail, Stock } from '../models';
import { GenerateUtils, PageableUtils } from '../utils';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants';
import { BadRequestError } from '../errors';
import { Op } from 'sequelize';
import { CartProduct } from '../dto/cart.dto';

@injectable()
class OrderService {
  constructor(@inject(delay(() => UserService)) private userService: UserService,
              @inject(delay(() => CartService)) private cartService: CartService,
              @inject(delay(() => StockService)) private stockService: StockService,
              @inject(delay(() => ProductService)) private productService: ProductService,
              @inject(delay(() => VoucherService)) private voucherService: VoucherService,
              @inject(delay(() => ShipFeeService)) private shipFeeService: ShipFeeService) {
  }

  create = async (email: string, payload: OrderCreateRequest) => {
    if (!payload.products || !payload.products.length) throw new BadRequestError('Product is empty');
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
    // const stocks = await Promise.all(orderDetails.map(async (el) => {
    //   const stock = await this.stockService.getStockByProductSubDetailIdAndSiteId(el.productSubDetailId, payload.siteId);
    //   if (stock.unit < el.unit) {
    //     throw new BadRequestError('Purchase order exceeds stock unit!');
    //   }
    //   stock.unit -= el.unit;
    //   return stock;
    // }));
    // await Stock.bulkCreate(stocks);
    if (payload.cartCode) {
      await this.cartService.removeAllCartDetails(payload.cartCode);
    }
    return {
      order, orderDetails: payload.products,
    };
  };

  async updateStatusPayment(code: string, paymentStatus: PAYMENT_STATUS) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    return await order.update({ paymentStatus });
  }

  async updateStatusOrder(code: string, status: ORDER_STATUS) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    return await order.update({ status });
  }

  async getAll(filter?: OrderFilter) {
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
            { code: { [Op.like]: likeOp } },
            { customerName: { [Op.like]: likeOp } },
            { customerPhone: { [Op.like]: likeOp } },
          ],
        });
      }
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
    const orders = await Order.findAll({
      order: pageRequest.order,
      offset: pageRequest.offset,
      limit: pageRequest.limit,
      where: whereCondition[Op.and].length ? whereCondition : undefined,
      include: [{
        model: OrderDetail,
        attributes: ['unit', 'totalPrice'],
        include: [{
          model: ProductSubDetail,
          attributes: ['color', 'size'],
          include: [{
            model: Product,
            attributes: ['name', 'thumbnailUrl', 'originalPrice'],
          }],
        },
        ],
      }],
    });
    return orders.map(this.map2Dto);
  }

  async getOrderByOrderCode(orderCode: string) {
    const order = await Order.findOne({
      where: { code: orderCode },
      include: [{
        model: OrderDetail,
        attributes: ['unit', 'totalPrice'],
        include: [{
          model: ProductSubDetail,
          attributes: ['color', 'size'],
          include: [{
            model: Product,
            attributes: ['name', 'thumbnailUrl', 'originalPrice'],
          }],
        },
        ],
      }],
    });
    if (!order) {
      throw new BadRequestError('Order not found!');
    }
    return this.map2Dto(order);
  }

  map2Dto(order: Order) {
    return {
      id: order.id,
      siteId: order.siteId,
      code: order.code,
      email: order.email,
      voucherCode: order.voucherCode,
      shipFee: order.shipFee,
      customerName: order.customerName,
      customerAddress: order.customerAddress,
      customerPhone: order.customerPhone,
      totalPrice: order.totalPrice,
      paymentType: order.paymentType,
      paymentStatus: order.paymentStatus,
      status: order.status,
      shippedAt: order.shippedAt,
      products: order.OrderDetails.map((el) => ({
        productId: el.productSubDetail.productId,
        productName: el.productSubDetail.Product.name,
        size: el.productSubDetail.size,
        color: el.productSubDetail.color,
        unit: el.unit,
        totalPrice: el.totalPrice,
        originalPrice: el.totalPrice,
        thumbnailUrl: el.productSubDetail.Product.thumbnailUrl,
      } as CartProduct)),
    } as OrderDto;
  }
}

export default OrderService;
