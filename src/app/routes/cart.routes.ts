import { container } from '../config';
import { CartController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const cartController = container.resolve(CartController);
const router = Router();

router.post('', jwtMiddleware.verifyToken, cartController.addToCartDetails);

router.post('/guest', cartController.addToCartDetailsForGuest);

router.put('', jwtMiddleware.verifyToken, cartController.updateCartDetails);

router.put('/guest', cartController.updateCartDetailsForGuest);

router.post('', jwtMiddleware.verifyToken, cartController.syncCartDetails);

router.post('/guest', jwtMiddleware.verifyToken, cartController.syncCartDetailsForGuest);

router.delete('', jwtMiddleware.verifyToken, cartController.removeCartDetail);

router.delete('/guest', cartController.removeCartDetailForGuest);

export default router;
