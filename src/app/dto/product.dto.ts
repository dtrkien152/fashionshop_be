import { SORT_BY_ENUM } from '../constants';

export interface IProductFilterParams
{
  keyword?: string;
  categoryId?: number;
  sortBy?: SORT_BY_ENUM;
  limit?: number;
  page?: number;
}
// Giao diện cho ProductSubDetail (Chi tiết sản phẩm con)
export interface IProductSubDetailResponse {
  id: number;
  size: string;
  color: string;
  isActive: boolean;
  totalQuantity: number;
}

// Giao diện cho Product (Sản phẩm chính)
export interface IProductDetailResponse {
  product_id: number;
  productName: string;
  category_id: number;
  category_name: string;
  productSubDetails: IProductSubDetailResponse[];
}

