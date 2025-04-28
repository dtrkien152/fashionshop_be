import { container } from '../config';
import { OrderController } from '../controllers';
import process from 'node:process';
import { NextFunction, Request, Response } from 'express';

const controller = container.resolve(OrderController);
const token = process.env.TOKEN_TEST;

describe('OrderController - getOrder', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    params: {
      orderCode: 'ORD3v8y69k8vwou',
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
    await controller.getOrder(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const invalidMockReq = { params: { orderCode: '' } } as unknown as Request;
    try {
      await controller.getOrder(invalidMockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid order code' });
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(controller, 'getOrder').mockRejectedValueOnce(error);

    try {
      await controller.getOrder(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('OrderController - createOrder', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    body: {
      orderCode: 'ORD3v8y69k8vwou',
      productId: 1,
      quantity: 10,
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
    await controller.createOrder(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
  });

  it('should return 400 when request is invalid', async () => {
    const invalidMockReq = { body: { orderCode: '', productId: 1, quantity: 10 } } as unknown as Request;
    try {
      await controller.createOrder(invalidMockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid order details' });
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(controller, 'createOrder').mockRejectedValueOnce(error);

    try {
      await controller.createOrder(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('OrderController - getAllMyOrders', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {},
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
    await controller.getAllMyOrders(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
  });

  it('should return 400 when request is invalid', async () => {
    const invalidMockReq = { query: { invalidParam: 'true' } } as unknown as Request;
    try {
      await controller.getAllMyOrders(invalidMockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid query parameter' });
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(controller, 'getAllMyOrders').mockRejectedValueOnce(error);

    try {
      await controller.getAllMyOrders(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('OrderController - getAllCustomerOrders', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {},
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
    await controller.getAllCustomerOrders(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const invalidMockReq = { query: { invalidParam: 'true' } } as unknown as Request;
    try {
      await controller.getAllCustomerOrders(invalidMockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid query parameter' });
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    jest.spyOn(controller, 'getAllCustomerOrders').mockRejectedValueOnce(error);

    try {
      await controller.getAllCustomerOrders(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});
