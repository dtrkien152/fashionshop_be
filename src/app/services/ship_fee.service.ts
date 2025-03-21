import { injectable } from 'tsyringe';
import { ShipFeeCreateRequest, ShipFeeUpdateRequest } from '../dto';
import { IShipFee, ShipFee } from '../models';

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
}

export default ShipFeeService;
