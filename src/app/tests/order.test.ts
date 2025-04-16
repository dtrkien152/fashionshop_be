import { container } from '../config';
import { OrderController, StatsController } from '../controllers';
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
});

describe('OrderController - createOrder', () => {
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
});

describe('OrderController - getAllMyOrders', () => {
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
});