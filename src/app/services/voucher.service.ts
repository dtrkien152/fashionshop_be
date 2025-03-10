import { injectable } from 'tsyringe';
import { IVoucher, UserVoucher, Voucher } from '../models';
import { VoucherCreateRequest, VoucherUpdateRequest } from '../dto';
import { GenerateUtils } from '../utils';

@injectable()
class VoucherService {
  constructor() {
  }

  async getByCode(code: string) {
    return Voucher.findOne({ where: { code, isActive: true } });
  }

  async verifyVoucherUser(userId: number, voucherId: number) {
    const userVoucher = await UserVoucher.findOne({ where: { userId, voucherId, isActive: true } });
    return !!userVoucher;
  }

  async add(payload: VoucherCreateRequest) {
    const voucher: IVoucher = { ...payload, code: GenerateUtils.code('VOU').toUpperCase(), isActive: true };
    return await Voucher.create(voucher);
  }

  async update(payload: VoucherUpdateRequest) {
    const voucher = await Voucher.findByPk(payload.id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    return await voucher.update(payload);
  }

  async deactivate(id: number) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    await voucher.update({ isActive: false });
    return { success: true };
  }

  async getVoucherInUser(userId: number) {
    return await UserVoucher.findAll({ where: { userId, isActive: true } });
  }

  async addVoucherForUser(userId: number, voucherCode: string) {
    const voucher = await this.getByCode(voucherCode);
    if (!voucher) throw new Error('Voucher not found');
    return await UserVoucher.create({ userId, voucherId: voucher.id, isActive: true });
  }

  async deactivateVoucherForUser(userVoucherId: number) {
    const userVoucher = await UserVoucher.findByPk(userVoucherId);
    if (!userVoucher) {
      throw new Error('User voucher not found');
    }
    await userVoucher.update({ isActive: false });
    return { success: true };
  }
}

export default VoucherService;
