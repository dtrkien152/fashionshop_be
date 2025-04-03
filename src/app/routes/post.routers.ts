import express, { RequestHandler, Router } from 'express';
import { container } from '../config';
import { PostController } from '../controllers';
import { jwtMiddleware } from '../middlewares';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Lưu vào bộ nhớ để upload lên Azure
const postController = container.resolve(PostController);

/**
 * @swagger
 * /api/posts/top5lastest:
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
 * /api/posts/search:
 *   post:
 *     summary: Lấy danh sách bài viết theo category
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID của category, nếu null sẽ lấy tất cả
 *               page:
 *                 type: integer
 *                 default: 1
 *               size:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết theo category.
 *       400:
 *         description: Lỗi request.
 */

router.post('/search', postController.getByCategory);

/**
 * @swagger
 * /api/posts/category/all:
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
 * /api/posts/detail/{code}:
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

/**
 * @swagger
 * /api/posts/gettopPostLastest:
 *   get:
 *     summary: Lấy danh sách 8 bài viết mới nhất
 *     description: Endpoint này trả về danh sách 8 bài viết mới nhất được sắp xếp theo thời gian tạo bài viết.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Trả về danh sách các bài viết mới nhất.
 *       500:
 *         description: Lỗi máy chủ khi lấy dữ liệu.
 */
router.get('/gettopPostLastest', postController.getTop8LastestPost);


/**
 * @swagger
 * /api/posts/add-comment:
 *   post:
 *     summary: Thêm bình luận vào bài viết
 *     tags:
 *       - Bình luận
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: number
 *                 description: ID của bài viết
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận
 *     responses:
 *       200:
 *
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-comment', jwtMiddleware.verifyToken, postController.addComment);

router.put(
  '/update',
  upload.fields([{ name: 'thumbnail', maxCount: 1 }]), // Hỗ trợ upload 1 thumbnail
  postController.updatePost as RequestHandler,
);

router.put('/:postId/status', postController.updatePostStatus);

router.post('/search-by-admin', postController.searchByAdmin);

router.get('/tags/recommend', postController.getRecommendTag);

router.post('/create',
  upload.fields([{ name: 'thumbnail', maxCount: 1 }]), // Hỗ trợ upload thumbnail
  postController.createPost as RequestHandler,
);

router.get('/admin/detail', postController.getPostDetailByADMIN);

export default router;
