import { container } from '../config';
import { StatsController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const statsController = container.resolve(StatsController);
const router = Router();

router.get('/revenue', jwtMiddleware.verifyToken, statsController.getRevenueStats);

router.get('/top-products', jwtMiddleware.verifyToken, statsController.getTopSellingProducts);

export default router;