export type OrderDirection = 'ASC' | 'DESC' | 'asc' | 'desc';

export interface PageParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
}

export interface PageResult {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Array<any>;
}