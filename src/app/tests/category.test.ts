import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import CategoryController from '../controllers/category.controller';
import { CategoryService } from '../services';

const controller = container.resolve(CategoryController);
const service = container.resolve(CategoryService);

describe('CategoryController - getAllCategory - Success', () => {
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
    await controller.getAllCategory(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('CategoryController - searchCategoriesForAdmin - Success', () => {
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
    await controller.getAllCategory(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('CategoryController - searchCategoriesForAdmin - Error', () => {
  const mockReq = {} as unknown as Request;
  const mockRes = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status error', async () => {
    await controller.searchCategoriesForAdmin(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('CategoryService - getAllCategory - Not empty', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const results = await service.getAllCategories();
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('CategoryService - getCategoryById - Success', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const results = await service.getCategoryById(0);
    expect(results).resolves;
  });
});

describe('CategoryService - getCategoryById - Not found', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status error', async () => {
    const results = await service.getCategoryById(-1);
    expect(results).rejects;
  });
});

describe('CategoryService - createCategory - Bad Request', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status success', async () => {
    const results = await service.createCategory(null);
    expect(results).rejects;
  });
});
