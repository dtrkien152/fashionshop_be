import { container } from '../config';
import { StockController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const stockController = container.resolve(StockController);

const router = Router();

router.get('', jwtMiddleware.verifyEmployeeToken, stockController.getAllStock);

router.get('/history', jwtMiddleware.verifyEmployeeToken, stockController.getHistoryStock);

router.post('', jwtMiddleware.verifyEmployeeToken, stockController.upsertStock);

export default router;