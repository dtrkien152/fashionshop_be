import { SORT_BY_ENUM } from '../constants';

export interface IProductFilterParams
{
  keyword?: string;
  categoryId?: number;
  sortBy?: SORT_BY_ENUM;
  limit?: number;
  page?: number;
}