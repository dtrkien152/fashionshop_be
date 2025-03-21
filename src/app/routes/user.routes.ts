import express from 'express';
import { container } from '../config';
import { jwtMiddleware } from '../middlewares';
import { UserController } from '../controllers';
import multer from "multer"
const router = express.Router();
const userController = container.resolve(UserController);
 const  upload=multer();
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
router.get('/profile', jwtMiddleware.verifyToken, userController.getMyProfile);

/**
 * @swagger
 * /api/user/profile:
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
router.put('/profile', jwtMiddleware.verifyToken, userController.updateMyProfile);

/**
 * @swagger
 * /api/user/address:
 *   post:
 *     summary: Tạo mới địa chỉ cho user
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
 *               city:
 *                 type: string
 *                 example: "Hà Nội"
 *               fullAddress:
 *                 type: string
 *                 example: "Số 123, Đường ABC, Quận XYZ"
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Địa chỉ được tạo thành công
 *       400:
 *         description: Lỗi dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/address', jwtMiddleware.verifyToken, userController.createAddress);

/**
 * @swagger
 * /api/user/address:
 *   put:
 *     summary: Cập nhật thông tin địa chỉ của user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của địa chỉ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: "TP Hồ Chí Minh"
 *               fullAddress:
 *                 type: string
 *                 example: "Số 456, Đường DEF, Quận XYZ"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *       400:
 *         description: Lỗi dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy địa chỉ
 *       500:
 *         description: Lỗi server
 */
router.put('/address', jwtMiddleware.verifyToken, userController.updateAddress);

/**
 * @swagger
 * /api/user/address/{id}/default:
 *   put:
 *     summary: Cập nhật địa chỉ mặc định cho user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của địa chỉ cần đặt làm mặc định
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ mặc định thành công
 *       400:
 *         description: Lỗi dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy địa chỉ
 *       500:
 *         description: Lỗi server
 */
router.put('/address/:id/default', jwtMiddleware.verifyToken, userController.updateDefaultAddress);

router.get('/address', jwtMiddleware.verifyToken, userController.getAddress);

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Quản lý địa chỉ người dùng
 */

// Xóa địa chỉ người dùng
router.delete('/address/:id',jwtMiddleware.verifyToken, userController.deleteAddress);

// Xóa địa chỉ người dùng
router.post('/upload-avatar',upload.single('file'),jwtMiddleware.verifyToken, userController.uploadAvatar);
export default router;
