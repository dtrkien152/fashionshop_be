import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const productController = container.resolve(OrderController);
const router = Router();

router.get('', jwtMiddleware.verifyToken, productController.getAllOrders);

router.get('/customers', jwtMiddleware.verifyToken, productController.getAllCustomerOrders);

router.get('/tracking/:orderCode', productController.getOrder);

router.post('', productController.createOrder);

router.put('', jwtMiddleware.verifyToken, productController.updateStatusOrder);

router.put('/payment', jwtMiddleware.verifyToken, productController.updateStatusPayment);

router.put('/return', jwtMiddleware.verifyToken, productController.handleReturnOrder);

router.get('/my-orders', jwtMiddleware.verifyToken, productController.getAllMyOrders);

router.post('/my-orders', jwtMiddleware.verifyToken, productController.createMyOrder);

router.get('/vnpay/build-url', productController.buildUrlPayment);

router.get('/vnpay/results', productController.verifyPayment);

export default router;
