import { container } from '../config';
import { OrderController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const productController = container.resolve(OrderController);
const router = Router();

router.get('', jwtMiddleware.verifyToken, productController.getAllOrders);

router.get('/tracking/:orderCode', productController.getOrder);

router.post('', productController.createOrder);

router.put('', jwtMiddleware.verifyToken, productController.updateStatusOrder);

router.get('/my-orders', jwtMiddleware.verifyToken, productController.getAllMyOrders);

router.post('/my-orders', jwtMiddleware.verifyToken, productController.createMyOrder);

export default router;
