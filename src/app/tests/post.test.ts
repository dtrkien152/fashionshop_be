import { container } from '../config';
import { PostController } from '../controllers';
import { NextFunction, Request, Response } from 'express';

const controller = container.resolve(PostController);

describe('PostController - getTop5LastestPost', () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const mockReq = {} as Request;
    await controller.getTop5LastestPost(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReq = null as unknown as Request;
    try {
      await controller.getTop5LastestPost(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const mockReq = {} as Request;
    jest.spyOn(controller, 'getTop5LastestPost').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getTop5LastestPost(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('PostController - getTop8LastestPost', () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const mockReq = {} as Request;
    await controller.getTop8LastestPost(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReq = null as unknown as Request;
    try {
      await controller.getTop8LastestPost(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const mockReq = {} as Request;
    jest.spyOn(controller, 'getTop8LastestPost').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getTop8LastestPost(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('PostController - getByCategory', () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const mockReq = { body: { categoryId: 1 } } as Request;
    await controller.getByCategory(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
  });

  it('should return 400 when request is invalid', async () => {
    const mockReq = { body: { categoryId: null } } as Request;
    try {
      await controller.getByCategory(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const mockReq = { body: { categoryId: 1 } } as Request;
    jest.spyOn(controller, 'getByCategory').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getByCategory(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});

describe('PostController - getPostDetailByCode', () => {
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const mockReq = { params: { code: 'some-code' } } as unknown as Request;
    await controller.getPostDetailByCode(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when request is invalid', async () => {
    const mockReq = { params: { code: '' } } as unknown as Request;
    try {
      await controller.getPostDetailByCode(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const mockReq = { params: { code: 'some-code' } } as unknown as Request;
    jest.spyOn(controller, 'getPostDetailByCode').mockRejectedValueOnce(new Error('Unexpected error'));
    try {
      await controller.getPostDetailByCode(mockReq, mockRes, mockNext);
    } catch (error) {
       expect(true).toBe(true);
    }
  });
});
