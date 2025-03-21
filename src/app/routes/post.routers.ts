import express from 'express';
import { container } from '../config';
import { PostController } from '../controllers';
import { jwtMiddleware } from '../middlewares';

const router = express.Router();
const postController = container.resolve(PostController);

/**
 * @swagger
 * /posts/top5lastest:
 *   get:
 *     summary: Lấy 5 bài viết mới nhất
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Trả về danh sách 5 bài viết mới nhất.
 */
router.get('/top5lastest', postController.getTop5LastestPost);

/**
 * @swagger
 * /posts/by-category/{categoryId}:
 *   get:
 *     summary: Lấy danh sách bài viết theo category
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của category
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết theo category.
 *       404:
 *         description: Không tìm thấy category.
 */
router.get('/by-category/:categoryId', postController.getByCategory);

/**
 * @swagger
 * /posts/category/all:
 *   get:
 *     summary: Lấy tất cả category kèm số bài viết trong mỗi category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Trả về danh sách category.
 */
router.get('/category/all', postController.getAllcategory);

/**
 * @swagger
 * /posts/detail/{code}:
 *   get:
 *     summary: Lấy chi tiết bài viết theo mã code
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã code của bài viết
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết bài viết.
 *       404:
 *         description: Không tìm thấy bài viết.
 */
router.get('/detail/:code', postController.getPostDetailByCode);

export default router;
