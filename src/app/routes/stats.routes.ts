import { container } from '../config';
import { StatsController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const statsController = container.resolve(StatsController);
const router = Router();

router.get('/revenue', jwtMiddleware.verifyUserToken, statsController.getRevenueStats);

router.get('/top-sell', jwtMiddleware.verifyUserToken, statsController.getTopSellingProducts);

router.get('/monthly', jwtMiddleware.verifyUserToken, statsController.getStatsInMonth);

router.get('/top-stock', jwtMiddleware.verifyUserToken, statsController.getTopStockProduct);

export default router;