import { OrderDirection, PageResult } from '../dto';
import { Order } from 'sequelize';

const PageableUtils = {
  pageRequest: (page: number = 1, limit: number = 10, orderBy: string = 'createdAt', orderDirection: OrderDirection = 'DESC'): {
    limit: number,
    offset: number,
    order?: Order
  } => {
    const offset = (page - 1) * limit;
    const order: Order = !!orderBy ? [[orderBy, orderDirection]] : undefined;
    return { limit, offset, order };
  },
  pageResponse: (page: number = 1, limit: number = 10, rows: any[], count: number) => {
    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    } as PageResult;
  },
};

export default PageableUtils;