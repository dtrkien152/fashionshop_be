import { injectable } from 'tsyringe';
import { ShipFeeCreateRequest, ShipFeeUpdateRequest } from '../dto';
import { IShipFee, ShipFee } from '../models';
import { SORT_BY_ENUM } from '../constants';
import { Op } from 'sequelize';

@injectable()
class ShipFeeService {
  constructor() {
  }

  getFee = async (totalPrice: number) => {
    let fee = 50000;
    let results: ShipFee;
    const shipFees = await this.getAll();
    for (const shipFee of shipFees) {
      if (totalPrice >= shipFee.triggerPrice && fee > shipFee.fee) {
        fee = shipFee.fee;
        results = shipFee;
      }
    }
    return results.toJSON();
  };

  create = async (payload: ShipFeeCreateRequest) => {
    const shipFee: IShipFee = payload;
    shipFee.isActive = true;
    return await ShipFee.create(shipFee);
  };

  update = async (payload: ShipFeeUpdateRequest) => {
    const shipFee = await ShipFee.findByPk(payload.id);
    if (!shipFee) {
      throw new Error('Ship fee not found');
    }
    return await shipFee.update(payload);
  };

  deactivate = async (id: number) => {
    const shipFee = await ShipFee.findByPk(id);
    if (!shipFee) {
      throw new Error('Ship fee not found');
    }
    shipFee.isActive = false;
    return { success: true };
  };

  getAll = async () => {
    return await ShipFee.findAll({ where: { isActive: true } });
  };


  async searchShipFeeByAdmin({ keyword, page = 1, limit = 10, sortBy = SORT_BY_ENUM.NEWEST }) {
    const whereCondition: any = {};

    if (keyword) {
      whereCondition.name = { [Op.like]: `%${keyword}%` };
    }

    const offset = (Number(page) - 1) * Number(limit);

    let orderCondition;
    switch (sortBy) {
      case SORT_BY_ENUM.NEWEST:
        orderCondition = [['createdAt', 'DESC']];
        break;
      case SORT_BY_ENUM.LATEST:
        orderCondition = [['createdAt', 'ASC']];
        break;
      default:
        orderCondition = [['createdAt', 'DESC']];
    }

    const { count, rows } = await ShipFee.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'name', 'triggerPrice', 'fee', 'isActive', 'createdAt', 'updatedAt'],
      order: orderCondition,
      limit: Number(limit),
      offset: Number(offset),
      subQuery: false,
    });

    return {
      total: count,
      data: rows,
    };
  }

  async updateStatus(param: { status: any; id: any }) {
    const { id, status } = param;

    const fee = await ShipFee.findByPk(id);

    if (!fee) {
      throw new Error('Không tìm thấy phí');
    }

    await ShipFee.update(
      { isActive: status },
      { returning: undefined, where: { id } }
    );
  }

  async updateFee(body: any) {

  }

  async createShipFee(data: { triggerPrice: number; shipPrice: number; status: boolean; name: string }) {
    const existingFee = await ShipFee.findOne({ rejectOnEmpty: undefined, where: { triggerPrice: data.triggerPrice } });
    if (existingFee) {
      throw new Error('Đã tồn tại mức phí với giá trị kích hoạt này');
    }

    const allFees = await ShipFee.findAll({
      order: [['triggerPrice', 'ASC']],
    });

    // Nếu không có phí ship nào thì cho tạo luôn
    if (allFees.length === 0) {
      const newFee = await ShipFee.create({
        triggerPrice: data.triggerPrice,
        fee: data.shipPrice,
        isActive: data.status,
        name: data.name,
      });
      return newFee;
    }

    let lowerFee: IShipFee | null = null;
    let higherFee: IShipFee | null = null;

    for (const fee of allFees) {
      if (fee.triggerPrice! <= data.triggerPrice) {
        lowerFee = fee;
      }
      if (fee.triggerPrice! > data.triggerPrice && !higherFee) {
        higherFee = fee;
      }
    }

    // Nếu shipPrice > 0 thì cần validate theo khoảng
    if (data.shipPrice > 0) {
      if (lowerFee && data.shipPrice >= lowerFee.fee!) {
        throw new Error(`Không hợp lệ: Phí ship (${this.formatCurrency(data.shipPrice)}) phải nhỏ hơn ${this.formatCurrency(lowerFee.fee!)} của mức giá thấp hơn (${this.formatCurrency(lowerFee.triggerPrice!)}).`);
      }
      if (higherFee && data.shipPrice <= higherFee.fee!) {
        throw new Error(`Không hợp lệ: Phí ship (${this.formatCurrency(data.shipPrice)}) phải lớn hơn ${this.formatCurrency(higherFee.fee!)} của mức giá cao hơn (${this.formatCurrency(higherFee.triggerPrice!)}).`);
      }
    }

    const newFee = await ShipFee.create({
      triggerPrice: data.triggerPrice,
      fee: data.shipPrice,
      isActive: data.status,
      name: data.name,
    });

    return newFee;
  }


  async updateShipFee(data: { id: number; name: string; triggerPrice?: number; shipPrice?: number; status: boolean }) {
    const fee = await ShipFee.findByPk(data.id);
    if (!fee) {
      throw new Error('Không tìm thấy phí');
    }

    // Nếu update triggerPrice, check trùng
    if (data.triggerPrice && data.triggerPrice !== fee.triggerPrice) {
      const existingFee = await ShipFee.findOne({
        rejectOnEmpty: undefined,
        where: { triggerPrice: data.triggerPrice }
      });
      if (existingFee) {
        throw new Error('Đã tồn tại mức phí với triggerPrice này');
      }
    }

    const newTriggerPrice = data.triggerPrice ?? fee.triggerPrice;
    const newShipPrice = data.shipPrice ?? fee.fee;

    const allFees = await ShipFee.findAll({
      where: {
        id: { [Op.ne]: data.id }, // Tránh check chính nó
      },
      order: [['triggerPrice', 'ASC']],
    });

    let lowerFee: IShipFee | null = null;
    let higherFee: IShipFee | null = null;

    for (const item of allFees) {
      if (item.triggerPrice! <= newTriggerPrice) {
        lowerFee = item;
      }
      if (item.triggerPrice! > newTriggerPrice && !higherFee) {
        higherFee = item;
      }
    }

    if (newShipPrice > 0) {
      if (lowerFee && newShipPrice >= lowerFee.fee!) {
        throw new Error(`Không hợp lệ: Phí ship (${this.formatCurrency(newShipPrice)}) phải nhỏ hơn ${this.formatCurrency(lowerFee.fee!)} của mức giá thấp hơn (${this.formatCurrency(lowerFee.triggerPrice!)}).`);
      }
      if (higherFee && newShipPrice <= higherFee.fee!) {
        throw new Error(`Không hợp lệ: Phí ship (${this.formatCurrency(newShipPrice)}) phải lớn hơn ${this.formatCurrency(higherFee.fee!)} của mức giá cao hơn (${this.formatCurrency(higherFee.triggerPrice!)}).`);
      }
    }

    await fee.update({
      triggerPrice: newTriggerPrice,
      fee: newShipPrice,
      isActive: data.status ?? fee.isActive,
      name: data.name ?? fee.name,
    });

    return fee;
  }

  formatCurrency(amount: number) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

}

export default ShipFeeService;
