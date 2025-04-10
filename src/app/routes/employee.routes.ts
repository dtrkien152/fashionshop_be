import { container } from '../config';
import { EmployeeController, SiteController } from '../controllers';
import { Router } from 'express';

const employeeController = container.resolve(EmployeeController);
const siteController = container.resolve(SiteController);
const router = Router();
router.post('/search', employeeController.search);
router.put('/update-role-site', employeeController.updateRoleSite);
router.get('/detail/:id', employeeController.getDetail);
router.patch('/update-status', employeeController.updateStatus);
router.get('/sites', siteController.getAllSite);
export default router;
