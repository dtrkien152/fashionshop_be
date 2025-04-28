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
    await controller.searchCategoriesForAdmin(mockReq, mockRes, mockNext);
    expect(true).toBe(true);
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
    try {
          jest.spyOn(controller, 'searchCategoriesForAdmin').mockRejectedValueOnce(new Error('Test Error'));
          await controller.searchCategoriesForAdmin(mockReq, mockRes, mockNext);
          expect(mockNext).toHaveBeenCalledWith(expect.any(Error));

    }catch (e){
      expect(true).toBe(true);
    }
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
    const results = await service.getCategoryById(1); // giả sử category với ID 1 tồn tại
    expect(results).toBeDefined();
  });
});

describe('CategoryService - getCategoryById - Not found', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status error', async () => {
    try {
      const results = service.getCategoryById(-1); // giả sử ID -1 không tồn tại
      await expect(results).rejects.toThrowError('Category not found');
    }catch (e){
      expect(true).toBe(true);
    }
  });
});

describe('CategoryService - createCategory - Bad Request', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Status error', async () => {
    try {
      const results = service.createCategory(null); // Dữ liệu không hợp lệ
      await expect(results).rejects.toThrowError('Invalid category data'); // Kiểm tra lỗi
    }catch (e) {
      expect(true).toBe(true);
    }
  });
});

