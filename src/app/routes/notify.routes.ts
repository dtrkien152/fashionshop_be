import express from 'express';
import { container } from '../config';
import { NotifyController } from '../controllers';

const router = express.Router();
const notifyController = container.resolve(NotifyController);

router.get('', notifyController.getAllNotify);

router.get('/polling', notifyController.checkNewNotify);

export default router;
