import { injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';

@injectable()
class ShipFeeController {

  constructor() {
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

  getFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  };

}

export default ShipFeeController;