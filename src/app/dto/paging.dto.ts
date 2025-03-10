export type OrderDirection = 'ASC' | 'DESC' | 'asc' | 'desc';

export interface PageParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
}