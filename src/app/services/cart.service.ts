import { injectable } from 'tsyringe';
import { CartDetailRequest, CartProduct } from '../dto/cart.dto';

@injectable()
class CartService {
  constructor() {
  }


  async addToCartDetail(products: CartProduct[], fingerprint: string, userId?: number) {
    return {}
  }

  async updateCartDetail(products: CartProduct[], fingerprint: string, userId?: number) {

  }

  async syncCartDetail(products: CartProduct[], fingerprint: string, userId?: number) {

  }

  async removeCartDetail(productSubDetailId: number, fingerprint: string, userId?: number) {
    return {a: 2}
  }
}
export default CartService;
