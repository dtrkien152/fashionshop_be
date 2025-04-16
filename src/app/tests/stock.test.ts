import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import { SiteController, StockController } from '../controllers';
import process from 'node:process';

const controller = container.resolve(StockController);

const token = process.env.TOKEN_TEST;
describe('StockController - getAllStock', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {},
  } as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    await controller.getAllStock(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('StockController - getAllStockInSite', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {},
  } as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    await controller.getAllStock(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});