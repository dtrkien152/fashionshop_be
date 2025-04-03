import { PageParams } from './paging.dto';

export interface VoucherCreateRequest {
  triggerPrice?: number;
  discountPercent?: number;
  maxDiscountPrice?: number;
  startAt?: Date;
  endAt?: Date;
}

export interface VoucherUpdateRequest extends VoucherCreateRequest {
  id: number;
}

export interface UserVoucherCreateRequest {
  userId: number;
  voucherCode: string;
}

export interface VoucherFilter extends PageParams {
  searchTerm?: string;
  searchBy?: string;
  code?: string;
  isActive?: string;
}