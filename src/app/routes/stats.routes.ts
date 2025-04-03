import { container } from '../config';
import { StatsController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const statsController = container.resolve(StatsController);
const router = Router();

router.get('/revenue', jwtMiddleware.verifyToken, statsController.getRevenueStats);

router.get('/top-sell', jwtMiddleware.verifyToken, statsController.getTopSellingProducts);

router.get('/monthly', jwtMiddleware.verifyToken, statsController.getStatsInMonth);

router.get('/top-stock', jwtMiddleware.verifyToken, statsController.getTopStockProduct);

export default router;