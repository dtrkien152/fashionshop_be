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
import {
  IOrder,
  IOrderDetail, Notify,
  Order,
  OrderDetail,
  Product,
  ProductSubDetail,
  ProductSubDetailReview,
  ReturnOrder,
  Site,
  Stock, UserVoucher,
} from '../models';
import { GenerateUtils, PageableUtils } from '../utils';
import { ORDER_STATUS, PAYMENT_STATUS, SITE_NAMES } from '../constants';
import { BadRequestError, NotFoundError } from '../errors';
import { Op, where } from 'sequelize';
import { CartProduct } from '../dto/cart.dto';
import { Sequelize } from 'sequelize-typescript';
import { sequelize } from '../config';

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
    const originTotalPrice = payload.products.reduce((acc, cur) => acc + cur.priceInUnit * cur.unit, 0);
    let shipFee = 0;
    if (payload.customer?.districtId && payload.customer?.wardCode) {
      const shipFeeGhn = await this.ghnService.calculator(payload.customer?.districtId, payload.customer?.wardCode);
      shipFee = shipFeeGhn.fee;
    }
    let discountPrice = 0;
    if (payload.voucherCode) {
      const voucher = await this.voucherService.getByCode(payload.voucherCode);
      const user = await this.userService.getByEmail(email);
      if (!user) throw new BadRequestError('Email is invalid');
      if (await this.voucherService.verifyVoucherUser(user.id, voucher.id)) {
        if (originTotalPrice > voucher.triggerPrice) {
          discountPrice = Math.min(originTotalPrice * (voucher.discountPercent / 100), voucher.maxDiscountPrice);
          await UserVoucher.update({ isActive: false }, {
            where: {
              userId: user.id,
              voucherId: voucher.id,
            },
            transaction: t,
          });
        }
      } else throw new BadRequestError('Voucher is invalid!');
    }
    const order: IOrder = {
      siteId: payload.siteId,
      code: GenerateUtils.code('ORD'),
      email: email,
      voucherCode: payload.voucherCode,
      voucherDiscountPrice: discountPrice,
      shipFee: shipFee,
      customerName: payload.customer?.name,
      customerAddress: payload.customer?.address,
      customerPhone: payload.customer?.phone,
      customerDistrictId: payload.customer?.districtId,
      customerWardCode: payload.customer?.wardCode,
      originTotalPrice: originTotalPrice,
      paymentType: payload.payment.type,
      paymentStatus: payload.payment.status,
      status: payload.status ?? ORDER_STATUS.PENDING,
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
      if (stock.unit - el.unit <= 10) {
        const productSubDetail = payload.products.find((p0) => p0.productSubDetailId === el.productSubDetailId);
        if (productSubDetail) {
          await Notify.create({
            type: 'WARNING',
            title: 'Cảnh báo sắp hết hàng trong kho',
            content: `Sản phẩm ${productSubDetail.productName}(${productSubDetail.color} - ${productSubDetail.size}) tại chi nhánh ${SITE_NAMES[+payload.siteId]} sắp hết hàng. Vui lòng bổ sung thêm sản phẩm vào kho.`,
          }, { transaction: t });
        }
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
    switch (status) {
      case ORDER_STATUS.PENDING:
      case ORDER_STATUS.CONFIRMED:
      case ORDER_STATUS.COMPLETED:
        return await order.update({ status });
      case ORDER_STATUS.REJECTED:
        return this.handleRejectOrder(code);
      case ORDER_STATUS.CANCEL:
        return this.handleCancelOrder(code);
      case ORDER_STATUS.RETURN:
        return this.handleReturnOrder(code, '');
      case ORDER_STATUS.SHIPPING:
        return this.handleShippingOrder(code, 10, 20, 100);
    }
  }

  async getReturnOrder(code: string) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    const returnOrder = ReturnOrder.findByPk(order.id);
    if (!returnOrder) throw new BadRequestError('Return order not found!');
    return returnOrder;
  }

  async handleCancelOrder(code: string) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    const orderDetails = await OrderDetail.findAll({ where: { orderId: order.id } });
    await Promise.all(orderDetails.map((el) => {
      return this.stockService.updateUnitInStock(el.productSubDetailId, order.siteId, el.unit);
    }));
    return await order.update({ status: ORDER_STATUS.CANCEL });
  }

  async handleRejectOrder(code: string) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    const orderDetails = await OrderDetail.findAll({ where: { orderId: order.id } });
    await Promise.all(orderDetails.map((el) => {
      return this.stockService.updateUnitInStock(el.productSubDetailId, order.siteId, el.unit);
    }));
    return await order.update({ status: ORDER_STATUS.REJECTED });
  }

  async handleReturnOrder(code: string, reason: string) {
    const order = await Order.findOne({ where: { code } });
    if (!order) throw new BadRequestError('Order not found!');
    await ReturnOrder.upsert({
      orderId: order.id,
      totalPrice: order.originTotalPrice,
      reason: reason,
    });
    const orderDetails = await OrderDetail.findAll({ where: { orderId: order.id } });
    await Promise.all(orderDetails.map((el) => {
      return this.stockService.updateUnitInStock(el.productSubDetailId, order.siteId, el.unit);
    }));
    return await order.update({ status: ORDER_STATUS.RETURN });
  }

  async handleShippingOrder(code: string, weight: string | number, width: string | number, height: string | number) {
    const orderDto = await this.getOrderByOrderCode(code);
    if (!orderDto) throw new BadRequestError('Order not found!');
    const shipResponse = await this.ghnService.createOrderShipping(orderDto, +weight, +width, +height);
    const order = await Order.findOne({ where: { code } });
    return await order.update({ status: ORDER_STATUS.SHIPPING, shipCode: shipResponse.data.data.order_code });
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
    if (filter.paymentType) {
      whereCondition[Op.and].push({
        paymentType: filter.paymentType,
      });
    }
    if (filter.siteId) {
      whereCondition[Op.and].push({
        siteId: +filter.siteId,
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
          attributes: ['id', 'color', 'size'],
          include: [{
            model: Product,
            attributes: ['id', 'name', 'thumbnailUrl', 'originalPrice'],
          }],
        },
        ],
      }, {
        model: Site,
        attributes: ['name'],
      },
      ],
      distinct: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows.map(this.map2Dto), count);
  }

  async getOrderByOrderCode(orderCode: string): Promise<OrderDto> {
    const order = await Order.findOne({
      where: { code: orderCode },
      include: [
        {
          model: OrderDetail,
          attributes: ['productSubDetailId', 'unit', 'totalPrice'],
          include: [{
            model: ProductSubDetail,
            attributes: ['id', 'color', 'size'],
            include: [{
              model: Product,
              attributes: ['id', 'name', 'thumbnailUrl', 'originalPrice'],
            }],
          },
          ],
        },
        {
          model: ProductSubDetailReview,
        },
        {
          model: Site,
          attributes: ['name'],
        },
      ],
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
      siteName: order.site.name,
      code: order.code,
      email: order.email,
      voucherCode: order.voucherCode,
      voucherDiscountPrice: order.voucherDiscountPrice,
      shipFee: order.shipFee,
      customerName: order.customerName,
      customerAddress: order.customerAddress,
      customerPhone: order.customerPhone,
      customerDistrictId: order.customerDistrictId,
      customerWardCode: order.customerWardCode,
      originTotalPrice: order.originTotalPrice,
      paymentType: order.paymentType,
      paymentStatus: order.paymentStatus,
      status: order.status,
      shippedAt: order.shippedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shipCode: order.shipCode,
      products: order.OrderDetails.map((el) => ({
        productSubDetailId: el.productSubDetailId,
        productId: el.productSubDetail.Product.id,
        productName: el.productSubDetail.Product.name,
        size: el.productSubDetail.size,
        color: el.productSubDetail.color,
        unit: el.unit,
        totalPrice: el.totalPrice,
        originalPrice: el.totalPrice,
        thumbnailUrl: el.productSubDetail.Product.thumbnailUrl,
        review: order.productSubDetailReviews
          ? order.productSubDetailReviews.find((review) => review.productSubDetailId === el.productSubDetailId)
          : undefined,
      } as CartProduct)),
    } as OrderDto;
  }

  async getOrderTotalPriceByOrderCode(orderCode: string) {
    const order = await Order.findOne({
      where: { code: orderCode },
      attributes: ['originTotalPrice', 'voucherDiscountPrice'],
    });
    if (!order) {
      throw new NotFoundError('Order not found!');
    }
    return order.originTotalPrice - order.voucherDiscountPrice;
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
        [Sequelize.fn('SUM', Sequelize.col('origin_total_price')), 'totalRevenue'],
        [Sequelize.fn('SUM', Sequelize.col('voucher_discount_price')), 'totalDiscountRevenue'],
      ],
      where: whereCondition,
      group: ['email'],
      order: [['email', 'DESC']],
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      raw: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows.map(this.map2CustomerOrderDto), count);
  }

  map2CustomerOrderDto(payload: any) {
    return {
      email: payload.email,
      totalOrders: payload.totalOrders,
      totalRevenue: payload.totalRevenue - payload.totalDiscountRevenue,
    };
  };
}

export default OrderService;
