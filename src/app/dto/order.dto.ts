import { PageParams } from './paging.dto';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } from '../constants';
import { CartProduct } from './cart.dto';

export interface OrderCreateRequest {
  siteId: number;
  customer?: OrderCustomer;
  products: OrderProduct[];
  payment: OrderPayment;
  voucherCode?: string;
  cartCode?: string;
}

export interface OrderPayment {
  type: PAYMENT_METHOD;
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
  searchTerm?: string;
  searchBy?: string;
  email?: string;
  status?: ORDER_STATUS;
  paymentStatus?: PAYMENT_STATUS;
  startAt?: string;
  endAt?: string;
}

export interface OrderDto {
  products: CartProduct[];
  id: number;
  siteId: number;
  code: string;
  email: string;
  voucherCode: string;
  shippedAt: Date;
  shipFee: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  totalPrice: number;
  paymentType: string;
  paymentStatus: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}