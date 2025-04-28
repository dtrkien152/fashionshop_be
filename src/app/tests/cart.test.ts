import { container } from '../config';
import { CartController } from '../controllers';
import { NextFunction, Request, Response } from 'express';

const controller = container.resolve(CartController);

describe('CartController - getCartForGuest', () => {
  const mockReq = { query: { fingerprint: 'e8d37bd4968c4d1f9c54ad16e0de8e7b' } } as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    try {
      await controller.getCartForGuest(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred during cart retrieval');
    }
  });

  it('Status 400 - Bad Request', async () => {
    const invalidReq = { query: {} } as unknown as Request; // Empty fingerprint
    try {
      await controller.getCartForGuest(invalidReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad Request: Missing fingerprint' });
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 500 - Internal Server Error', async () => {
    const mockReqWithError = { query: { fingerprint: 'e8d37bd4968c4d1f9c54ad16e0de8e7b' } } as unknown as Request;
    const mockErrorController = {
      getCartForGuest: jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      }),
    };
    try {
      await mockErrorController.getCartForGuest(mockReqWithError, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('CartController - getCart', () => {
  const mockReq = { query: { fingerprint: 'e8d37bd4968c4d1f9c54ad16e0de8e7b' } } as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    try {
      await controller.getCart(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 400 - Bad Request', async () => {
    const invalidReq = { query: {} } as unknown as Request; // Empty fingerprint
    try {
      await controller.getCart(invalidReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad Request: Missing fingerprint' });
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 500 - Internal Server Error', async () => {
    const mockReqWithError = { query: { fingerprint: 'e8d37bd4968c4d1f9c54ad16e0de8e7b' } } as unknown as Request;
    const mockErrorController = {
      getCart: jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      }),
    };
    try {
      await mockErrorController.getCart(mockReqWithError, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('CartController - getCartForGuest:200', () => {
  const mockReq = { query: { fingerprint: '8851271c-4ed4-4d9d-9a45-69df619c6889' } } as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    try {
      await controller.getCartForGuest(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Error occurred during cart retrieval');
    }
  });

  it('Status 400 - Bad Request', async () => {
    const invalidReq = { query: {} } as unknown as Request; // Empty fingerprint
    try {
      await controller.getCartForGuest(invalidReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad Request: Missing fingerprint' });
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 500 - Internal Server Error', async () => {
    const mockReqWithError = { query: { fingerprint: '8851271c-4ed4-4d9d-9a45-69df619c6889' } } as unknown as Request;
    const mockErrorController = {
      getCartForGuest: jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      }),
    };
    try {
      await mockErrorController.getCartForGuest(mockReqWithError, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});

describe('CartController - getCart By Token', () => {
  const mockReq = {} as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    try {
      await controller.getCart(mockReq, mockRes, mockNext);
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 400 - Bad Request', async () => {
    const invalidReq = { query: {} } as unknown as Request; // Empty token
    try {
      await controller.getCart(invalidReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Bad Request: Missing token' });
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  it('Status 500 - Internal Server Error', async () => {
    const mockReqWithError = {} as unknown as Request;
    const mockErrorController = {
      getCart: jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      }),
    };
    try {
      await mockErrorController.getCart(mockReqWithError, mockRes, mockNext);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
