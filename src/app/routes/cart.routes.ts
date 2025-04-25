import { container } from '../config';
import { CartController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const cartController = container.resolve(CartController);
const router = Router();

router.get('/info/guest', cartController.getCartForGuest);

router.get('/info', jwtMiddleware.verifyUserToken, cartController.getCart);

router.get('', cartController.getCartDetails);

router.post('', cartController.addToCartDetails);

router.put('', cartController.updateToCartDetails);

router.post('/sync', cartController.syncCartDetails);

router.delete('', cartController.removeCartDetail);


export default router;
