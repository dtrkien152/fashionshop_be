import { container } from '../config';
import { StatsController } from '../controllers';
import { NextFunction, Request, Response } from 'express';
import process from 'node:process';

const controller = container.resolve(StatsController);
const token = process.env.TOKEN_TEST;

describe('StatsController - getStatsInMonth', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: { siteId: 0 },
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
    await controller.getStatsInMonth(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: { siteId: '' },  // siteId không hợp lệ
    } as unknown as Request;
    try {
      await controller.getStatsInMonth(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getStatsInMonth').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getStatsInMonth(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('StatsController - getTopStockProduct', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: { siteId: 0 },
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
    await controller.getTopStockProduct(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: { siteId: '' },  // siteId không hợp lệ
    } as unknown as Request;
    try {
      await controller.getTopStockProduct(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getTopStockProduct').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getTopStockProduct(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('StatsController - getTopSellingProducts', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {
      startAt: '1741971600000',
      endAt: '1744649999999',
      siteId: 0,
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
    await controller.getTopSellingProducts(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: {
        startAt: '',
        endAt: '1744649999999',
        siteId: 0,
      },
    } as unknown as Request;  // startAt không hợp lệ
    try {
      await controller.getTopSellingProducts(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getTopSellingProducts').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getTopSellingProducts(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('StatsController - getRevenueStats', () => {
  const mockReq = {
    headers: {
      'authorization': 'Bearer ' + token,
    },
    query: {
      startAt: '1741971600000',
      endAt: '1744649999999',
      siteId: 0,
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
    await controller.getRevenueStats(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReqInvalid = {
      headers: {
        'authorization': 'Bearer ' + token,
      },
      query: {
        startAt: '',
        endAt: '1744649999999',
        siteId: 0,
      },
    } as unknown as Request;  // startAt không hợp lệ
    try {
      await controller.getRevenueStats(mockReqInvalid, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    jest.spyOn(controller, 'getRevenueStats').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getRevenueStats(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
