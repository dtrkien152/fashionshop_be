import { container } from '../config';
import { EmployeeController } from '../controllers';
import { Router } from 'express';

const employeeController = container.resolve(EmployeeController);
const router = Router();

export default router;