export interface CartDetailRequest {
  cartCode: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  color: string;
  size: string;
  unit: number;
}
