import express from 'express';
import { container } from '../config';
import { GHNController } from '../controllers';
import multer from 'multer';
import { jwtMiddleware } from '../middlewares';

const router = express.Router();
const ghnController = container.resolve(GHNController);



router.get('/wards', ghnController.getWard);

router.get('/provinces', ghnController.getProvince);

router.get('/districts', ghnController.getDistrict);

export default router;
