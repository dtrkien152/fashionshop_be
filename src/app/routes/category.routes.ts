import { container } from '../config';
import { Router } from 'express';
import CategoryController from '../controllers/category.controller';
import multer from 'multer';

const categoryController = container.resolve(CategoryController);
const upload = multer(); // Middleware xử lý file upload
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
//
// // Tạo mới danh mục
// router.post('/manager/create', categoryController.createCategory);

// Cập nhật danh mục
router.put('/manager/update', categoryController.updateCategory);

router.get('/manager/:categoryId', categoryController.getCategoryById);
router.put('/manager/updateStatus', categoryController.updateStatus);

router.post('/manager/update', upload.single('thumbnail'), categoryController.updateCategory);

router.post('/manager/create', upload.single('thumbnail'), categoryController.createCategory);

export default router;
