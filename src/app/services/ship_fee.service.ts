import { injectable } from 'tsyringe';

@injectable()
class ShipFeeService {
  constructor() {
  }

  getFee = async (totalPrice: number) => {
    return 0;
  };

  create = () => {
  };

  update = () => {
  };

  deactivate = () => {
  };

  getAll = () => {
  };
}

export default ShipFeeService;