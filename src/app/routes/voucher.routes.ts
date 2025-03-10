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

router.post('', jwtMiddleware.verifyToken, voucherController.addVoucher);

router.put('', jwtMiddleware.verifyToken, voucherController.updateVoucher);

router.delete('', jwtMiddleware.verifyToken, voucherController.deactivateVoucher);

router.get('/my-voucher', jwtMiddleware.verifyToken, voucherController.getMyVoucher);

router.post('/my-voucher', jwtMiddleware.verifyToken, voucherController.addMyVoucher);

router.post('/user/:userId', jwtMiddleware.verifyToken, voucherController.getVoucherInUser);

router.put('/user/:userId', jwtMiddleware.verifyToken, voucherController.addVoucherForUsers);

router.delete('/user/:userId', jwtMiddleware.verifyToken, voucherController.deactivateVoucherForUser);

export default router;
