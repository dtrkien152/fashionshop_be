import { container } from '../config';
import { EmployeeController, SiteController } from '../controllers';
import { Router } from 'express';
import multer from 'multer';

const employeeController = container.resolve(EmployeeController);
const siteController = container.resolve(SiteController);
const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Lưu vào bộ nhớ để upload lên Azure

router.post('/search', employeeController.search);
router.put('/update-role-site', employeeController.updateRoleSite);
router.get('/detail/:id', employeeController.getDetail);
router.patch('/update-status', employeeController.updateStatus);
router.get('/sites', siteController.getAllSite);
router.post(
  '/create',
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  employeeController.createEmployee
);

export default router;
