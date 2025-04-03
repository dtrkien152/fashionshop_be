import { inject, injectable } from 'tsyringe';
import { MailService, OrderService, VNPayService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { OrderCreateRequest, OrderFilter } from '../dto/order.dto';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '../constants';
import { BadRequestError } from '../errors';

@injectable()
class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService,
              @inject(MailService) private mailService: MailService,
              @inject(VNPayService) private vnPayService: VNPayService) {
  }

  buildUrlPayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { orderCode } = req.query;
      if (!orderCode) {
        throw new BadRequestError('orderCode not found');
      }
      const totalPrice = await this.orderService.getOrderTotalPriceByOrderCode(orderCode as string);
      const paymentUrl = this.vnPayService.buildUrlPayment(orderCode as string, totalPrice, req.ip);
      return res.json({ paymentUrl });
    } catch (error) {
      next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const query = req.query;
      const results = this.vnPayService.verifyReturnUrl(query);
      if (results.isVerified && results.isSuccess) {
        await this.orderService.updateStatusPayment(results.orderCode, PAYMENT_STATUS.PAID);
      }
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  createMyOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: OrderCreateRequest = req.body;
      const email = req.session['email'];
      const results = await this.orderService.create(email as string, payload);
      this.mailService.sendConfirmOrder(email as string, results.order, results.orderDetails).then(() => {
        console.log('Send mail confirm successfully');
      });
      if (payload.payment.type === PAYMENT_METHOD.VNPAY) {
        const paymentUrl = this.vnPayService.buildUrlPayment(results.order.code, results.order.totalPrice, req.ip);
        return res.json({ order: results.order, paymentUrl });
      }
      return res.json({ order: results.order });
    } catch (error) {
      next(error);
    }
  };

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: OrderCreateRequest = req.body;
      const { email } = req.query;
      if (!email) throw new BadRequestError('Email is required');
      const results = await this.orderService.create(email as string, payload);
      this.mailService.sendConfirmOrder(email as string, results.order, results.orderDetails).then(() => {
        console.log('Send mail confirm successfully');
      });
      return res.json({ order: results.order });
    } catch (error) {
      next(error);
    }
  };

  updateStatusOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code, status } = req.query;
      const results = await this.orderService.updateStatusOrder(code as string, status as ORDER_STATUS);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  updateStatusPayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code, status } = req.query;
      const results = await this.orderService.updateStatusPayment(code as string, status as PAYMENT_STATUS);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  handleReturnOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { code, reason } = req.query;
      const results = await this.orderService.handleReturnOrder(code as string, reason as string);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getAllMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const email = req.session['email'];
      const filterParams = req.query as OrderFilter;
      filterParams.email = email;
      const results = await this.orderService.getAll(filterParams);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const filterParams = req.query as OrderFilter;
      const results = await this.orderService.getAll(filterParams);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const orderCode = req.params['orderCode'];
      const results = await this.orderService.getOrderByOrderCode(orderCode);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
