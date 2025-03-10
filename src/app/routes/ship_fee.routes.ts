import { container } from '../config';
import { ShipFeeController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const shipFeeController = container.resolve(ShipFeeController);
const router = Router();

router.get('', shipFeeController.getAll);

router.post('', jwtMiddleware.verifyToken, shipFeeController.create);

router.put('', jwtMiddleware.verifyToken, shipFeeController.update);

router.delete('', jwtMiddleware.verifyToken, shipFeeController.deactivate);

router.get('/calculator', shipFeeController.getFee);

export default router;
