import { PageParams } from './paging.dto';

export interface StockFilter extends PageParams {
  searchTerm?: string;
  searchBy?: string;
  siteId?: string;
}

export interface HistoryStockFilter extends PageParams {
  siteId?: string;
  productSubDetailId?: string;
}

export interface StockProductDto {
  productId: number;
  productName: string;
  thumbnailUrl: string;
  code: string;
  unitInStock: number;
  productSubDetails: StockProductSubDetailDto[];
}

export interface StockProductSubDetailDto {
  productSubDetailId: number;
  color: string;
  size: string;
  unitInStock: number;
}
