import { container } from '../config';
import { EmployeeController, OrderController, StatsController } from '../controllers';
import process from 'node:process';
import { NextFunction, Request, Response } from 'express';

const controller = container.resolve(EmployeeController);
const token = process.env.TOKEN_TEST;

describe('EmployeeController - search', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    body: {
      params: { siteId: 1, role: undefined },
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
    await controller.search(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('EmployeeController - getDetail', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    body: {
      params: { siteId: 1, role: undefined },
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
    await controller.search(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});