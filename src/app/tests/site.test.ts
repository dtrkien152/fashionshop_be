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
});