import { PageParams } from './paging.dto';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants';

export interface OrderCreateRequest {
  siteId: number;
  customer: OrderCustomer;
  products: OrderProduct[];
  payment: OrderPayment;
  voucherCode: string;
}

export interface OrderPayment {
  type: number;
  status: PAYMENT_STATUS;
}

export interface OrderProduct {
  productId: number;
  color: string;
  size: string;
  unit: number;
  priceInUnit?: number;
  productName?: string;
  productSubDetailId?: number;
}

export interface OrderCustomer {
  name: string;
  address: string;
  phone: string;
}

export interface OrderDetailDto {
  productSubDetailId: number;
  productName: string;
  unit: number;
  totalPrice: number;
}

export interface OrderFilter extends PageParams {
  keyword?: string;
  email?: string;
  status?: ORDER_STATUS;
  paymentStatus?: PAYMENT_STATUS;
}