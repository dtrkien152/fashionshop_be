import { delay, inject, injectable } from 'tsyringe';
import { CartDetailRequest, CartProduct } from '../dto/cart.dto';
import { Cart, CartDetail, ICartDetail, Product, ProductSubDetail } from '../models';
import { ProductService } from './index';
import { NotFoundError } from '../errors';
import { GenerateUtils } from '../utils';
import { Op } from 'sequelize';

@injectable()
class CartService {
  constructor(@inject(delay(() => ProductService)) private productService: ProductService) {
  }

  async getCartByCode(cartCode: string) {
    const cart = await Cart.findOne({ where: { code: cartCode } });
    if (!cart) {
      throw new NotFoundError();
    }
    return cart;
  }

  async getCart(fingerprint: string, userId?: number) {
    let cart = await Cart.findOne({ where: { fingerprint } });
    if (userId) {
      cart = await Cart.findOne({ where: { userId } });
    }
    if (!cart) {
      if (userId) {
        cart = await Cart.create({
          code: GenerateUtils.code('CAR'),
          userId,
        });
      } else {
        cart = await Cart.create({
          code: GenerateUtils.code('CAR'),
          fingerprint,
        });
      }
    }
    return cart;
  }

  async getCartDetails(cartCode: string) {
    let cart = await this.getCartByCode(cartCode);
    const cartDetail = await CartDetail.findAll({
      where: { cartId: cart.id, unit: { [Op.gt]: 0 } },
      include: {
        model: ProductSubDetail,
        attributes: ['id', 'productId', 'color', 'size'],
        include: [{ model: Product, attributes: ['originalPrice', 'salePrice', 'name', 'thumbnailUrl'] }],
      },
    });
    return cartDetail.map((item) => ({
      productId: item.ProductSubDetail.productId,
      productName: item.ProductSubDetail.Product.name,
      thumbnailUrl: item.ProductSubDetail.Product.thumbnailUrl,
      originalPrice: item.ProductSubDetail.Product.originalPrice,
      salePrice: item.ProductSubDetail.Product.salePrice,
      color: item.ProductSubDetail.color,
      size: item.ProductSubDetail.size,
      unit: item.unit,
    }));
  }

  async addToCartDetail(cartCode: string, products: CartProduct[]) {
    const cart = await this.getCartByCode(cartCode);
    const cartDetail: ICartDetail[] = await Promise.all(products.map(async (p0) => {
      const productSubDetail = await this.productService.getSubProductByProductIdAndColorAndSize(p0.productId, p0.color, p0.size);
      if (!productSubDetail) {
        throw new NotFoundError('Product not found');
      }
      const cartDetailExists = await CartDetail.findOne({
        where: {
          productSubDetailId: productSubDetail.id,
          cartId: cart.id,
        },
      });
      return {
        cartId: cart.id,
        productSubDetailId: productSubDetail.id,
        unit: Math.max(p0.unit + (cartDetailExists ? cartDetailExists.unit : 0), 0),
      } as ICartDetail;
    }));
    await CartDetail.bulkCreate(cartDetail, { updateOnDuplicate: ['unit'] });
    return { cartDetail };
  }

  async changeUnitCartDetail(cartCode: string, products: CartProduct[]) {
    const cart = await this.getCartByCode(cartCode);
    const cartDetail: ICartDetail[] = await Promise.all(products.map(async (p0) => {
      const productSubDetail = await this.productService.getSubProductByProductIdAndColorAndSize(p0.productId, p0.color, p0.size);
      if (!productSubDetail) {
        throw new NotFoundError('Product not found');
      }
      const cartDetailExists = await CartDetail.findOne({
        where: {
          productSubDetailId: productSubDetail.id,
          cartId: cart.id,
        },
      });
      let unit = 0;
      if (cartDetailExists) {
        unit = Math.max(cartDetailExists.unit + p0.unit, 0);
      }
      return {
        cartId: cart.id,
        productSubDetailId: productSubDetail.id,
        unit: unit,
      } as ICartDetail;
    }));
    await CartDetail.bulkCreate(cartDetail, { updateOnDuplicate: ['unit'] });
    return { cartDetail };
  }

  async updateToCartDetail(cartCode: string, products: CartProduct[]) {
    const cart = await this.getCartByCode(cartCode);
    const cartDetail: ICartDetail[] = await Promise.all(products.map(async (p0) => {
      const productSubDetail = await this.productService.getSubProductByProductIdAndColorAndSize(p0.productId, p0.color, p0.size);
      if (!productSubDetail) {
        throw new NotFoundError('Product not found');
      }
      return {
        cartId: cart.id,
        productSubDetailId: productSubDetail.id,
        unit: Math.max(p0.unit, 0),
      } as ICartDetail;
    }));
    await CartDetail.bulkCreate(cartDetail, { updateOnDuplicate: ['unit'] });
    return { cartDetail };
  }

  async syncCartDetail(products: CartProduct[], cartCode: string) {

  }

  async removeCartDetail(cartCode: string, productId: number, color: string, size: string) {
    const cart = await this.getCartByCode(cartCode);
    const productSubDetail = await this.productService.getSubProductByProductIdAndColorAndSize(productId, color, size);
    if (!productSubDetail) {
      throw new NotFoundError('Product not found');
    }
    const cartDetail = await CartDetail.findOne({
      where: {
        productSubDetailId: productSubDetail.id,
        cartId: cart.id,
      },
    });
    if (!cartDetail) {
      throw new NotFoundError('Product in cart not found');
    }
    await cartDetail.destroy();
    return { success: true };
  }

  async removeAllCartDetails(cartCode: string) {
    const cart = await this.getCartByCode(cartCode);
    await CartDetail.destroy({ where: { cartId: cart.id } });
    return { success: true };
  }
}

export default CartService;
