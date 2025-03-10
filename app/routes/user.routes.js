import express from "express";
import { authJwt } from "../middleware/index.js";
import * as controller from "../controllers/user.controller.js";

const router = express.Router();

// Middleware CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

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
router.get("/profile", controller.getUserProfile);

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
router.put("/update-profile", authJwt.verifyToken, controller.updateProfile);

export default router;
