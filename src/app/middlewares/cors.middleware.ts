import { NextFunction, Request, Response } from 'express';

const addHeaderResponse = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*'); // 💡 Cho phép tất cả các origin
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true'); // Nếu cần cookie

  // Xử lý preflight request (OPTIONS)
  next();
};

const corsMiddleware = {
  addHeaderResponse,
};
export default corsMiddleware;