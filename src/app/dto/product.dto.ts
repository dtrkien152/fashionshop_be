import { SORT_BY_ENUM } from '../constants';

export interface IProductFilterParams {
  keyword?: string;
  categoryId?: number;
  sortBy?: SORT_BY_ENUM;
  limit?: number;
  page?: number;
  isDelete?: boolean;
  isActive?: boolean;
}

export interface IProductSubDetailResponse {
  id: number;
  size: string;
  color: string;
  isActive: boolean;
  unitInStocks: any;
}

export interface IProductDetailResponse {
  productId: number;
  productName: string;
  description: string;
  categoryId: number;
  brand?: string;
  gender?: string;
  weight?: string;
  category_name: string;
  other_info?: string;
  unitOnOrder: number;
  salePrice: number;
  originalPrice: number;
  thumbnailUrl: string;
  averageRating?: number;
  imageUrls?: string[];
  totalAvailable?: number;
  productSubDetails: IProductSubDetailResponse[];
}

export interface IProductItemResponse {
  id: number;
  category: string;
  productName: string;
  description?: string;
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

export interface IProductItem2Response {
  id?: number;
  category?: string;
  productName?: string;
  description?: string;
  salePrice?: number;
  originalPrice?: number;
  discountPercentage?: string;
  thumbnailUrl?: string;
  unitInStock?: number; //tổng unit on stock cac sub product
  unitOnOrder?: number;
  status?: boolean;
  isDelete?: boolean;
  isActive?: boolean;
  created_date?: boolean;
  created_by?: string;
  colors?: string[]; // Các thuộc tính của subproduct
  size?: string[]; // Các thuộc tính của subproduct
}
