import { container } from '../config';
import { SiteController, StockController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const siteController = container.resolve(SiteController);
const router = Router();

router.get('', jwtMiddleware.verifyToken, siteController.getAllSite);

export default router;