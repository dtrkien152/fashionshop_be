import express from 'express';
import { container } from '../config';
import jwtMiddleware from '../middlewares/jwt.middleware';
import { UserController } from '../controllers';

const router = express.Router();
const userController = container.resolve(UserController);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý thông tin user
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Lấy thông tin user từ session
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Phiên đăng nhập hết hạn
 *       500:
 *         description: Lỗi server
 */
router.get('/profile', jwtMiddleware.verifyToken, userController.getUserProfile);

/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân của user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               gender:
 *                 type: boolean
 *               phone:
 *                 type: string
 *     responses:
 *       200: { description: Cập nhật thành công }
 *       400: { description: Dữ liệu không hợp lệ }
 *       500: { description: Lỗi server }
 */
router.put('/update-profile', jwtMiddleware.verifyToken, userController.updateProfile);

export default router;
