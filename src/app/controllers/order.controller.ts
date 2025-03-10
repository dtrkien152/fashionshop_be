import { inject, injectable } from 'tsyringe';
import { MailService, OrderService, ProductService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { OrderCreateRequest } from '../dto/order.dto';

@injectable()
class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService,
              @inject(MailService) private mailService: MailService) {
  }

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: OrderCreateRequest = req.body;
      const results = await this.orderService.create(payload);
      this.mailService.sendConfirmOrder(payload.email, results.order, results.orderDetails).then(() => {
        console.log('Send mail confirm successfully');
      });
      return res.json(results.order);
    } catch (error) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getAllMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };
}

export default OrderController;