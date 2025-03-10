import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { VoucherService } from '../services';
import { UserVoucherCreateRequest, VoucherCreateRequest, VoucherUpdateRequest } from '../dto';
import { BadRequestError } from '../errors';

@injectable()
class VoucherController {

  constructor(@inject(VoucherService) private voucherService: VoucherService) {
  }

  addVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: VoucherCreateRequest = req.body;
      const results = await this.voucherService.add(payload);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  updateVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload: VoucherUpdateRequest = req.body;
      const results = await this.voucherService.update(payload);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  deactivateVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('Voucher id is required');
      const results = await this.voucherService.deactivate(+id);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getMyVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const vouchers = await this.voucherService.getVoucherInUser(+userId);
      return res.json({ vouchers });
    } catch (error) {
      next(error);
    }
  };

  addMyVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.session['userId'];
      const voucherCode = req.query['voucherCode'];
      const results = await this.voucherService.addVoucherForUser(userId, voucherCode as string);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  getVoucherInUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.query['userId'];
      const vouchers = await this.voucherService.getVoucherInUser(+userId);
      return res.json({ vouchers });
    } catch (error) {
      next(error);
    }
  };

  addVoucherForUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId, voucherCode } = req.body as UserVoucherCreateRequest;
      const results = await this.voucherService.addVoucherForUser(userId, voucherCode);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };

  deactivateVoucherForUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const results = await this.voucherService.deactivateVoucherForUser(+id);
      return res.json(results);
    } catch (error) {
      next(error);
    }
  };
}

export default VoucherController;