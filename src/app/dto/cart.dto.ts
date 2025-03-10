export interface CartDetailRequest {
  fingerprint: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  color: string;
  size: string;
  unit: number;
}
