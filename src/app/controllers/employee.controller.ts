import { inject, injectable } from 'tsyringe';
import { EmployeeService, FileService } from '../services';

@injectable()
class EmployeeController {
  constructor(@inject(EmployeeService) private employeeService: EmployeeService) {
  }
}

export default EmployeeController;