import { inject, injectable } from 'tsyringe';
import { CartService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { CartDetailRequest } from '../dto/cart.dto';

@injectable()
class CartController {
  constructor(@inject(CartService) private cartService: CartService) {
  }

  getCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const fingerprint = req.query['fingerprint'];
      const results = await this.cartService.getCart(fingerprint as string, userId);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getCartForGuest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const fingerprint = req.query['fingerprint'];
      const results = await this.cartService.getCart(fingerprint as string);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  getCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { cartCode } = req.query;
      const results = await this.cartService.getCartDetails(cartCode as string);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  addToCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.addToCartDetail(payload.cartCode, payload.products);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  updateToCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.updateToCartDetail(payload.cartCode, payload.products);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  syncCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.syncCartDetail(payload.products, payload.cartCode);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  removeCartDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { cartCode, productId, color, size } = req.query;
      const results = await this.cartService.removeCartDetail(cartCode as string, +productId, color as string, size as string);
      return res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
