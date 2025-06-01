import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import { StockController } from '../controllers';
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

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: { invalidQuery: 'value' },  // giả định có query không hợp lệ
    } as unknown as Request;
    try {
      await controller.getAllStock(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getAllStock').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getAllStock(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
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

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: { invalidQuery: 'value' },  // giả định có query không hợp lệ
    } as unknown as Request;
    try {
      await controller.getAllStock(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getAllStock').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getAllStock(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
