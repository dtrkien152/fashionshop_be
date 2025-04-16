import { container } from '../config';
import { VoucherController } from '../controllers';
import { Router } from 'express';
import { jwtMiddleware } from '../middlewares';

const voucherController = container.resolve(VoucherController);
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: API quản lý thông tin voucher
 */

router.get('', jwtMiddleware.verifyEmployeeToken, voucherController.getAllVoucher);

router.post('', jwtMiddleware.verifyEmployeeToken, voucherController.addVoucher);

router.put('', jwtMiddleware.verifyEmployeeToken, voucherController.updateVoucher);

router.put('/:id', jwtMiddleware.verifyEmployeeToken, voucherController.updateStatusVoucher);

router.get('/my-voucher', jwtMiddleware.verifyUserToken, voucherController.getMyVoucher);

router.post('/my-voucher', jwtMiddleware.verifyUserToken, voucherController.addMyVoucher);

router.post('/user', jwtMiddleware.verifyEmployeeToken, voucherController.getVoucherInUser);

router.put('/user', jwtMiddleware.verifyEmployeeToken, voucherController.addVoucherForUsers);

router.delete('/user/:userVoucherId', jwtMiddleware.verifyEmployeeToken, voucherController.deactivateVoucherForUser);

export default router;
