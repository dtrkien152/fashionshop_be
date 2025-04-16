import { container } from '../config';
import { StatsController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const statsController = container.resolve(StatsController);
const router = Router();

router.get('/revenue', jwtMiddleware.verifyEmployeeToken, statsController.getRevenueStats);

router.get('/top-sell', jwtMiddleware.verifyEmployeeToken, statsController.getTopSellingProducts);

router.get('/monthly', jwtMiddleware.verifyEmployeeToken, statsController.getStatsInMonth);

router.get('/top-stock', jwtMiddleware.verifyEmployeeToken, statsController.getTopStockProduct);

export default router;