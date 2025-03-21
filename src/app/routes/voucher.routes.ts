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

router.get('', jwtMiddleware.verifyToken, voucherController.getAllVoucher);

router.post('', jwtMiddleware.verifyToken, voucherController.addVoucher);

router.put('', jwtMiddleware.verifyToken, voucherController.updateVoucher);

router.put('/:id', jwtMiddleware.verifyToken, voucherController.updateStatusVoucher);

router.get('/my-voucher', jwtMiddleware.verifyToken, voucherController.getMyVoucher);

router.post('/my-voucher', jwtMiddleware.verifyToken, voucherController.addMyVoucher);

router.post('/user', jwtMiddleware.verifyToken, voucherController.getVoucherInUser);

router.put('/user', jwtMiddleware.verifyToken, voucherController.addVoucherForUsers);

router.delete('/user/:userVoucherId', jwtMiddleware.verifyToken, voucherController.deactivateVoucherForUser);

export default router;
