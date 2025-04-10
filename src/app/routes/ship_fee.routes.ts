import { container } from '../config';
import { ShipFeeController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const shipFeeController = container.resolve(ShipFeeController);
const router = Router();

router.get('', shipFeeController.getAll);

router.post('', jwtMiddleware.verifyUserToken, shipFeeController.create);

router.put('', jwtMiddleware.verifyUserToken, shipFeeController.update);

router.delete('/:id', jwtMiddleware.verifyUserToken, shipFeeController.deactivate);

router.get('/calculator', shipFeeController.getFee);

export default router;
