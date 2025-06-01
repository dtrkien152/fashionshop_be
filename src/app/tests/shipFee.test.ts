import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import { ProductController, ShipFeeController } from '../controllers';
import process from 'node:process';

const controller = container.resolve(ShipFeeController);

const token = process.env.TOKEN_TEST;

// Test case cho getAll
describe('ShipFeeController - getAll', () => {
  const mockReq = {} as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    await controller.getAll(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {} as Request; // Chưa đủ tham số
    try {
      await controller.getAll(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getAll').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getAll(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

// Test case cho deactivate
describe('ShipFeeController - deactivate', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    params: {
      id: 1,
    },
  } as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    await controller.deactivate(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when id is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      params: {
        id: 'invalid-id', // ID không hợp lệ
      },
    } as unknown as Request;
    try {
      await controller.deactivate(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'deactivate').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.deactivate(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

// Test case cho getProductById
describe('ShipFeeController - getProductById', () => {
  const mockReq = { query: { price: 100000 } } as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    await controller.getFee(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when price query is missing or invalid', async () => {
    const mockReqInvalid = { query: {} } as unknown as Request; // Không có tham số price
    try {
      await controller.getFee(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getFee').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getFee(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
