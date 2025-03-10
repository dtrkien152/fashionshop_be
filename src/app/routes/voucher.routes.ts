import { container } from '../config';
import { VoucherController } from '../controllers';
import { Router } from 'express';

const voucherController = container.resolve(VoucherController);
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: API quản lý thông tin voucher
 */

router.post('', voucherController.addVoucher);

router.put('', voucherController.updateVoucher);

router.delete('', voucherController.deactivateVoucher);

router.get('/my-voucher', voucherController.getMyVoucher);

router.post('/my-voucher', voucherController.addMyVoucher);

router.post('/user/:userId', voucherController.getVoucherInUser);

router.put('/user/:userId', voucherController.addVoucherForUsers);

router.delete('/user/:userId', voucherController.deactivateVoucherForUser);

export default router;