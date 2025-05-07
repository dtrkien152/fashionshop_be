import { container } from '../config';
import { ShipFeeController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const shipFeeController = container.resolve(ShipFeeController);
const router = Router();

router.get('', shipFeeController.getAll);

router.post('', jwtMiddleware.verifyEmployeeToken, shipFeeController.create);

router.put('', jwtMiddleware.verifyEmployeeToken, shipFeeController.update);

router.delete('/:id', jwtMiddleware.verifyEmployeeToken, shipFeeController.deactivate);

router.get('/calculator', shipFeeController.getFee);

router.post('/searchFeeByAdmin', shipFeeController.searchFeeByAdmin);

router.post('/updateStatus', shipFeeController.updateStatus); // <-- thêm dòng này

router.post('/updateFee', shipFeeController.updateFee);
router.post('/createFee', shipFeeController.createFee);
router.delete('/delete/:id', shipFeeController.deleteShipFee);
export default router;
