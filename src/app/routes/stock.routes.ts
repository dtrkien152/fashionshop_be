import { container } from '../config';
import { StockController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const stockController = container.resolve(StockController);

const router = Router();

router.get('', jwtMiddleware.verifyUserToken, stockController.getAllStock);

router.post('', jwtMiddleware.verifyUserToken, stockController.upsertStock);

export default router;