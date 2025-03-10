import { SORT_BY_ENUM } from '../constants';

export interface IProductFilterParams {
  keyword?: string;
  categoryId?: number;
  sortBy?: SORT_BY_ENUM;
  limit?: number;
  page?: number;
}

export interface IProductSubDetailResponse {
  id: number;
  size: string;
  color: string;
  isActive: boolean;
  totalQuantity: number;
}

export interface IProductDetailResponse {
  product_id: number;
  productName: string;
  category_id: number;
  category_name: string;
  productSubDetails: IProductSubDetailResponse[];
}

export interface IProductItemResponse {
  id: number;
  category: string;
  productName: string;
  salePrice: number;
  originalPrice: number;
  flag: {
    type: 'sale' | 'new' | 'hot';
    value: string;
  };
  thumbnailUrl: string;
  imageUrls: string[]; // Ảnh đầu là thumbnailUrl của product, ảnh sau là 1 ảnh của subproduct
  colors: string[]; // Các thuộc tính của subproduct
  size: string[]; // Các thuộc tính của subproduct
}
