import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors';

const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

const errorMiddleware = {
  errorHandler,
};

export default errorMiddleware;