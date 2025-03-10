import { NextFunction, Request, Response } from 'express';

const addHeaderResponse = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  next();
};

const corsMiddleware = {
  addHeaderResponse,
};
export default corsMiddleware;