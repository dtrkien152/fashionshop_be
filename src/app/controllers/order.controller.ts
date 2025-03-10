import { inject, injectable } from 'tsyringe';
import { MailService, OrderService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { OrderCreateRequest, OrderFilter } from '../dto/order.dto';
import { ORDER_STATUS } from '../constants';
import { BadRequestError } from '../errors';

@injectable()
class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService,
              @inject(MailService) private mailService: MailService) {
  }

  createMyOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: OrderCreateRequest = req.body;
      const email = req.session['email'];
      const results = await this.orderService.create(email as string, payload);
      this.mailService.sendConfirmOrder(email as string, results.order, results.orderDetails).then(() => {
        console.log('Send mail confirm successfully');
      });
      return res.json(results.order);
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
      return res.json(results.order);
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
}

export default OrderController;