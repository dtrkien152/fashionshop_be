import express from 'express';
import { container } from '../config';
import { FileController } from '../controllers';
import multer from 'multer';

const router = express.Router();
const fileController = container.resolve(FileController);
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-multiple', upload.array('files', 5), fileController.uploadMultiple.bind(fileController));

export default router;
