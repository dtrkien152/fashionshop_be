import { container } from '../config';
import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const categoryController = container.resolve(CategoryController);
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories API
 */

/**
 * @swagger
 * /api/categories/getAll:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/getAll', categoryController.getAllCategory);


// Lấy danh sách danh mục kèm số lượng sản phẩm
router.post('/manager/search', categoryController.searchCategoriesForAdmin);

// Tạo mới danh mục
router.post('/manager/create', categoryController.createCategory);

// Cập nhật danh mục
router.put('/manager/update/:id', categoryController.updateCategory);

export default router;
