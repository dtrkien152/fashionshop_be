import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const productController = container.resolve(OrderController);
const router = Router();

router.get('', jwtMiddleware.verifyUserToken, productController.getAllOrders);

router.get('/customers', jwtMiddleware.verifyUserToken, productController.getAllCustomerOrders);

router.get('/tracking/:orderCode', productController.getOrder);

router.post('', productController.createOrder);

router.put('', jwtMiddleware.verifyUserToken, productController.updateStatusOrder);

router.put('/payment', jwtMiddleware.verifyUserToken, productController.updateStatusPayment);

router.put('/return', jwtMiddleware.verifyUserToken, productController.handleReturnOrder);

router.get('/my-orders', jwtMiddleware.verifyUserToken, productController.getAllMyOrders);

router.post('/my-orders', jwtMiddleware.verifyUserToken, productController.createMyOrder);

router.get('/vnpay/build-url', productController.buildUrlPayment);

router.get('/vnpay/results', productController.verifyPayment);

export default router;
