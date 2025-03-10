export interface OrderCreateRequest {
  siteId: number;
  customer: OrderCustomer;
  products: OrderProduct[];
  payment: OrderPayment;
  voucherCode: string;
  email: string;
}

export interface OrderPayment {
  type: number;
  status: string;
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