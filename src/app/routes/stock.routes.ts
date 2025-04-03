import { container } from '../config';
import { StockController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const stockController = container.resolve(StockController);

const router = Router();

router.get('', jwtMiddleware.verifyToken, stockController.getAllStock);

router.post('', jwtMiddleware.verifyToken, stockController.upsertStock);

export default router;