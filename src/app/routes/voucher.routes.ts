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

router.get('', jwtMiddleware.verifyUserToken, voucherController.getAllVoucher);

router.post('', jwtMiddleware.verifyUserToken, voucherController.addVoucher);

router.put('', jwtMiddleware.verifyUserToken, voucherController.updateVoucher);

router.put('/:id', jwtMiddleware.verifyUserToken, voucherController.updateStatusVoucher);

router.get('/my-voucher', jwtMiddleware.verifyUserToken, voucherController.getMyVoucher);

router.post('/my-voucher', jwtMiddleware.verifyUserToken, voucherController.addMyVoucher);

router.post('/user', jwtMiddleware.verifyUserToken, voucherController.getVoucherInUser);

router.put('/user', jwtMiddleware.verifyUserToken, voucherController.addVoucherForUsers);

router.delete('/user/:userVoucherId', jwtMiddleware.verifyUserToken, voucherController.deactivateVoucherForUser);

export default router;
