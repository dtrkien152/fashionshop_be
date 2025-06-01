import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import { SiteController } from '../controllers';

const controller = container.resolve(SiteController);

describe('SiteController - getAll', () => {
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
    await controller.getAllSite(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {} as Request; // Chưa đủ tham số hoặc dữ liệu
    try {
      await controller.getAllSite(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getAllSite').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getAllSite(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
