import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const productController = container.resolve(OrderController);
const router = Router();

router.get('', jwtMiddleware.verifyEmployeeToken, productController.getAllOrders);

router.get('/customers', jwtMiddleware.verifyEmployeeToken, productController.getAllCustomerOrders);

router.get('/tracking/:orderCode', productController.getOrder);

router.post('', productController.createOrder);

router.put('', jwtMiddleware.verifyEmployeeToken, productController.updateStatusOrder);

router.put('/payment', jwtMiddleware.verifyEmployeeToken, productController.updateStatusPayment);

router.put('/return', jwtMiddleware.verifyEmployeeToken, productController.handleReturnOrder);

router.put('/shipping', jwtMiddleware.verifyEmployeeToken, productController.handleShippingOrder);

router.get('/my-orders', jwtMiddleware.verifyEmployeeToken, productController.getAllMyOrders);

router.post('/my-orders', jwtMiddleware.verifyEmployeeToken, productController.createMyOrder);

router.get('/vnpay/build-url', productController.buildUrlPayment);

router.get('/vnpay/results', productController.verifyPayment);

export default router;
