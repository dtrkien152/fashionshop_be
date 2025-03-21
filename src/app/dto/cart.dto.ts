export interface CartDetailRequest {
  cartCode: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  productName?: string | any;
  thumbnailUrl?: string | any;
  originalPrice?: number | any;
  salePrice?: number | any;
  color: string;
  size: string;
  unit: number;
}
