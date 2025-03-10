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