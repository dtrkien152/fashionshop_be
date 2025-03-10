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
 */
router.get("/api/user/profile", controller.getUserProfile);

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
 *               email:
 *                 type: string
 *               full_name:
 *                 type: string
 *               gender:
 *                 type: boolean
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 */
router.put("/update-profile", authJwt.verifyToken, controller.updateProfile);

export default router;
