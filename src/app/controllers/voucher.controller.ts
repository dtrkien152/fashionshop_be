import { injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';

@injectable()
class VoucherController {

  constructor() {
  }

  addVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  updateVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  deactivateVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getMyVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  addMyVoucher = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getVoucherInUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  addVoucherForUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  deactivateVoucherForUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };
}

export default VoucherController;