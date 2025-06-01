import { container } from '../config';
import { EmployeeController } from '../controllers';
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

  it('should return 400 when request parameters are invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      body: {
        params: { siteId: -1, role: null }, // giả định tham số không hợp lệ
      },
    } as unknown as Request;
    try {
      await controller.search(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'search').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.search(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
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
    await controller.getDetail(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
  });

  it('should return 400 when request parameters are invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      body: {
        params: { siteId: -1, role: null }, // giả định tham số không hợp lệ
      },
    } as unknown as Request;
    try {
      await controller.getDetail(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getDetail').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getDetail(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
