import { injectable } from 'tsyringe';
import { UserVoucher, Voucher } from '../models';

@injectable()
class VoucherService {
  constructor() {
  }

  async getByCode(code: string) {
    return Voucher.findOne({ where: { code, isActive: true } });
  }

  async verifyVoucherUser(userId: number, voucherId: number) {
    const userVoucher = await UserVoucher.findOne({ where: { userId, voucherId, isUsed: false } });
    return !!userVoucher;
  }
}

export default VoucherService;