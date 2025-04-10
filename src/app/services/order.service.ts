import { delay, inject, injectable } from 'tsyringe';
import { OrderCreateRequest, OrderCustomerFilter, OrderDto, OrderFilter } from '../dto/order.dto';
import {
  CartService,
  GhnService,
  ProductService,
  ShipFeeService,
  StockService,
  UserService,
  VoucherService,
} from './index';
import { IOrder, IOrderDetail, Order, OrderDetail, Product, ProductSubDetail, ReturnOrder, Stock } from '../models';
import { GenerateUtils, PageableUtils } from '../utils';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants';
import { BadRequestError, NotFoundError } from '../errors';
import { Op } from 'sequelize';
import { CartProduct } from '../dto/cart.dto';
import { Sequelize } from 'sequelize-typescript';
import { sequelize } from '../config';
import ghnService from './ghn.service';

@injectable()
class OrderService {
  constructor(@inject(delay(() => UserService)) private userService: UserService,
              @inject(delay(() => CartService)) private cartService: CartService,
              @inject(delay(() => StockService)) private stockService: StockService,
              @inject(delay(() => ProductService)) private productService: ProductService,
              @inject(delay(() => VoucherService)) private voucherService: VoucherService,
              @inject(delay(() => ShipFeeService)) private shipFeeService: ShipFeeService,
              @inject(delay(() => GhnService)) private ghnService: GhnService) {
  }

  create = async (email: string, payload: OrderCreateRequest) => {
    const t = await sequelize.transaction(); // Khởi tạo transaction
    if (!payload.products || !payload.products.length) throw new BadRequestError('Product is empty');
    const products = await Promise.all(payload.products.map(async (el) => {
      const product = await this.productService.getProductById(el.productId);
      el.priceInUnit = product.salePrice;
      el.productName = product.name;
      return product;
    }));
    const originTotalPrice = products.reduce((acc, cur) => acc + cur.salePrice, 0);
    const shipFee = await this.shipFeeService.getFee(originTotalPrice);
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
    const order: IOrder = {
      siteId: payload.siteId,
      code: GenerateUtils.code('ORD'),
      email: email,
      voucherCode: payload.voucherCode,
      shipFee: shipFee.fee,
      customerName: payload.customer?.name,
      customerAddress: payload.customer?.address,
      customerPhone: payload.customer?.phone,
      totalPrice: originTotalPrice - discountPrice,
      paymentType: payload.payment.type,
      paymentStatus: payload.payment.status,
      status: ORDER_STATUS.PENDING,
    };
    const orderCreated = await Order.create(order, { transaction: t });
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
    await OrderDetail.bulkCreate(orderDetails, { transaction: t });
    const stocks = await Promise.all(orderDetails.map(async (el) => {
      const stock = await this.stockService.getStockByProductSubDetailIdAndSiteId(el.productSubDetailId, payload.siteId);
      if (stock.unit < el.unit) {
        throw new BadRequestError('Purchase order exceeds stock unit!');
      }
      return {
        siteId: stock.siteId,
        productSubDetailId: el.productSubDetailId,
        unit: stock.unit - el.unit,
      };
    }));
    await Stock.bulkCreate(stocks, { transaction: t, updateOnDuplicate: ['unit'] });
    if (payload.cartCode) {
      await this.cartService.removeAllCartDetails(payload.cartCode);
    }
    await t.commit();
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
    if (status == ORDER_STATUS.RETURN) {
      await ReturnOrder.create({
        orderId: order.id,
        totalPrice: order.totalPrice,
        reason: '',
      });
    }
    return await order.update({ status });
  }

  async handleReturnOrder(code: string, reason: string) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    await ReturnOrder.create({
      orderId: order.id,
      totalPrice: order.totalPrice,
      reason: reason,
    });
    return await order.update({ status: ORDER_STATUS.RETURN });
  }

  async handleShippingOrder(code: string, weight: string, width: string, height: string) {
    const order = await this.getOrderByOrderCode(code);
    if (!order) throw new BadRequestError('Order not found!');
    const shipResponse = await this.ghnService.createOrderShipping(order, +weight, +width, +height);
    console.log(shipResponse);
    return await Order.update({ status: ORDER_STATUS.SHIPPING }, { where: { code } });
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
    if (filter.startAt) {
      whereCondition[Op.and].push({
        createdAt: {
          [Op.gte]: +filter.startAt,
        },
      });
    }
    if (filter.endAt) {
      whereCondition[Op.and].push({
        createdAt: {
          [Op.lte]: +filter.endAt,
        },
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
    const { rows, count } = await Order.findAndCountAll({
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      where: whereCondition[Op.and].length ? whereCondition : undefined,
      include: [{
        model: OrderDetail,
        attributes: ['productSubDetailId', 'unit', 'totalPrice'],
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
      distinct: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows.map(this.map2Dto), count);
  }

  async getOrderByOrderCode(orderCode: string): Promise<OrderDto> {
    const order = await Order.findOne({
      where: { code: orderCode },
      include: [{
        model: OrderDetail,
        attributes: ['productSubDetailId', 'unit', 'totalPrice'],
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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      products: order.OrderDetails.map((el) => ({
        productSubDetailId: el.productSubDetailId,
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

  async getOrderTotalPriceByOrderCode(orderCode: string) {
    const order = await Order.findOne({ where: { code: orderCode } });
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return order.totalPrice;
  }

  async getAllCustomerOrders(filter: OrderCustomerFilter) {
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
            { email: { [Op.like]: likeOp } },
          ],
        });
      }
    }
    if (filter.email) {
      whereCondition[Op.and].push({
        email: filter.email,
      });
    }

    const count = await Order.count({
      col: 'email',
      distinct: true, // Chỉ đếm email duy nhất
      where: {
        email: { [Op.ne]: null },
      },
    });

    const rows = await Order.findAll({
      attributes: [
        'email',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalOrders'],
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'totalRevenue'],
      ],
      where: whereCondition,
      group: ['email'],
      order: [['email', 'DESC']],
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      raw: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows, count);
  }
}

export default OrderService;
