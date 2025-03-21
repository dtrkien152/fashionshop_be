import { NextFunction, Request, Response } from 'express';

const addHeaderResponse = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*'); // Chỉ định FE domain
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true'); // Cần thiết cho cookie & session


  // Xử lý preflight request (OPTIONS)
  next();
};

const corsMiddleware = {
  addHeaderResponse,
};
export default corsMiddleware;