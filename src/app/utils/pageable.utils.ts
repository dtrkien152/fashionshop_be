import { OrderDirection } from '../dto';
import { Order } from 'sequelize';

const PageableUtils = {
  pageRequest: (page: number = 1, limit: number = 10, orderBy?: string, orderDirection?: OrderDirection): {
    limit: number,
    offset: number,
    order?: Order
  } => {
    const offset = (page - 1) * limit;
    const order: Order = !!orderBy ? [[orderBy, orderDirection]] : undefined;
    return { limit, offset, order };
  },
};

export default PageableUtils;