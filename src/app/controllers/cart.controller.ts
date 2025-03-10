import { inject, injectable } from 'tsyringe';
import { CartService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { CartDetailRequest } from '../dto/cart.dto';

@injectable()
class CartController {
  constructor(@inject(CartService) private cartService: CartService) {
  }

  addToCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.addToCartDetail(payload.products, payload.fingerprint, userId);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  addToCartDetailsForGuest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.addToCartDetail(payload.products, payload.fingerprint);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  updateCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.updateCartDetail(payload.products, payload.fingerprint, userId);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  updateCartDetailsForGuest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.updateCartDetail(payload.products, payload.fingerprint);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  syncCartDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.syncCartDetail(payload.products, payload.fingerprint, userId);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  syncCartDetailsForGuest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: CartDetailRequest = req.body;
      const results = await this.cartService.syncCartDetail(payload.products, payload.fingerprint);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  removeCartDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const { fingerprint, productSubDetailId } = req.query;
      const results = await this.cartService.removeCartDetail(+productSubDetailId, fingerprint as string, userId);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  removeCartDetailForGuest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { fingerprint, productSubDetailId } = req.query;
      const results = await this.cartService.removeCartDetail(+productSubDetailId, fingerprint as string);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
