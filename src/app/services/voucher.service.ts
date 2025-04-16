import { injectable } from 'tsyringe';
import { IUserVoucher, IVoucher, User, UserVoucher, Voucher } from '../models';
import { VoucherCreateRequest, VoucherFilter, VoucherUpdateRequest } from '../dto';
import { GenerateUtils, PageableUtils } from '../utils';
import { ROLE } from '../constants';
import { Op } from 'sequelize';
import moment from 'moment/moment';

@injectable()
class VoucherService {
  constructor() {
  }

  async getAllVoucher(filter: VoucherFilter) {
    const likeOp = `%${filter.searchTerm}%`;
    const pageRequest = PageableUtils.pageRequest(filter.page, filter.limit, filter.orderBy, filter.orderDirection);
    const whereCondition = {
      [Op.and]: [],
    };
    if (filter.searchTerm) {
      if (filter.searchBy) {
        whereCondition[Op.and].push({
          [filter.searchBy]: { [Op.like]: likeOp },
        });
      } else {
        whereCondition[Op.and].push({
          [Op.or]: [
            { code: { [Op.like]: likeOp } },
          ],
        });
      }
    }
    if (filter.isActive) {
      whereCondition[Op.and].push({
        status: filter.isActive == 'true',
      });
    }
    const { rows, count } = await Voucher.findAndCountAll({
      order: pageRequest.order,
      offset: +pageRequest.offset,
      limit: +pageRequest.limit,
      where: whereCondition[Op.and].length ? whereCondition : undefined,
      distinct: true,
    });
    return PageableUtils.pageResponse(filter.page, filter.limit, rows, count);
  }

  async getByCode(code: string) {
    return Voucher.findOne({ where: { code, isActive: true } });
  }

  async verifyVoucherUser(userId: number, voucherId: number) {
    const userVoucher = await UserVoucher.findOne({ where: { userId, voucherId, isActive: true } });
    return !!userVoucher;
  }

  async add(payload: VoucherCreateRequest, addForAll?: boolean) {
    const voucher: IVoucher = { ...payload, code: GenerateUtils.code('VOU').toUpperCase(), isActive: true };
    const voucherAdded = await Voucher.create(voucher);
    if (addForAll) {
      const userIds = await User.findAll({ where: { role: ROLE.USER }, attributes: ['id'] });
      const userVoucher = userIds.map((u) => ({
        userId: u.id,
        voucherId: voucherAdded.id,
        isActive: false,
      } as IUserVoucher));
      await UserVoucher.bulkCreate(userVoucher);
    }
    return voucherAdded;
  }

  async update(payload: VoucherUpdateRequest) {
    const voucher = await Voucher.findByPk(payload.id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    return await voucher.update(payload);
  }

  async updateStatusVoucher(id: number, status: boolean) {
    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      throw new Error('Voucher not found');
    }
    await voucher.update({ isActive: status });
    return { success: true };
  }

  async getVoucherInUser(userId: number) {
    const now = moment().utc().toDate();
    const userVouchers = await UserVoucher.findAll({
      where: { userId },
      attributes: ['isActive'],
      include: [{
        model: Voucher,
        where: {
          startAt: { [Op.lte]: now },
          endAt: { [Op.gte]: now },
          isActive: true,
        },
      }],
    });

    return userVouchers.map((uv) => ({
      voucher: uv.voucher,
      isUsed: !uv.isActive,
    }));
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
