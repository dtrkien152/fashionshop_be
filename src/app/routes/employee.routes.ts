import { container } from '../config';
import { EmployeeController, SiteController } from '../controllers';
import { Router } from 'express';
import multer from 'multer';
import { jwtMiddleware } from '../middlewares';

const employeeController = container.resolve(EmployeeController);
const siteController = container.resolve(SiteController);
const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Lưu vào bộ nhớ để upload lên Azure

router.post('/search', employeeController.search);
router.put('/update-role-site', employeeController.updateRoleSite);
router.get('/detail/:id', employeeController.getDetail);
router.put('/update-status', employeeController.updateStatus);
router.get('/sites', siteController.getAllSite);
router.post(
  '/create',
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  employeeController.createEmployee
);

router.put(
  '/update/:id',
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  employeeController.updateEmployee
);

// Cập nhật thông tin cá nhân
router.put('/profile', jwtMiddleware.verifyUserToken, employeeController.updateProfile);

router.post('/upload-avatar', upload.single('file'), jwtMiddleware.verifyUserToken, employeeController.uploadAvatar);

export default router;
