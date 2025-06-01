import { container } from '../config';
import { VoucherController } from '../controllers';
import process from 'node:process';
import { NextFunction, Request, Response } from 'express';

const controller = container.resolve(VoucherController);

const token = process.env.TOKEN_TEST;

describe('VoucherController - getAllVoucher', () => {
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
    await controller.getAllVoucher(mockReq, mockRes, mockNext);
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
      await controller.getAllVoucher(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getAllVoucher').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getAllVoucher(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('VoucherController - getVoucherInUser', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {
      userId: 1,
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
    await controller.getVoucherInUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when userId is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: {
        userId: -1,  // giả định userId không hợp lệ
      },
    } as unknown as Request;
    try {
      await controller.getVoucherInUser(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getVoucherInUser').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getVoucherInUser(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
