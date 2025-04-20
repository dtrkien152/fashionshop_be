import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const orderController = container.resolve(OrderController);
const router = Router();

router.get('', jwtMiddleware.verifyEmployeeToken, orderController.getAllOrders);

router.get('/customers', jwtMiddleware.verifyEmployeeToken, orderController.getAllCustomerOrders);

router.get('/tracking/:orderCode', orderController.getOrder);

router.post('', orderController.createOrder);

router.put('', jwtMiddleware.verifyEmployeeToken, orderController.updateStatusOrder);

router.put('/payment', jwtMiddleware.verifyEmployeeToken, orderController.updateStatusPayment);

router.put('/return', jwtMiddleware.verifyEmployeeToken, orderController.handleReturnOrder);

router.put('/shipping', jwtMiddleware.verifyEmployeeToken, orderController.handleShippingOrder);

router.get('/my-orders', jwtMiddleware.verifyEmployeeToken, orderController.getAllMyOrders);

router.post('/my-orders', jwtMiddleware.verifyEmployeeToken, orderController.createMyOrder);

router.get('/vnpay/build-url', orderController.buildUrlPayment);

router.get('/vnpay/results', orderController.verifyPayment);

export default router;
