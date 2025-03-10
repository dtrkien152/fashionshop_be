import express from "express";
import { verifySignUp } from "../middleware/index.js";
import * as controller from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import passport from "../services/googleService.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post("/signin", controller.signin);


/**
 * @swagger
 * /api/auth/activate:
 *   get:
 *     summary: Kích hoạt tài khoản người dùng
 *     description: API này được sử dụng để kích hoạt tài khoản bằng mã kích hoạt
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Mã kích hoạt của người dùng
 *         schema:
 *           type: string
 *          properties:
 *              code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kích hoạt thành công
 *       400:
 *         description: Mã kích hoạt không hợp lệ hoặc đã hết hạn
 */
router.get("/activate", controller.activateAccount);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Đăng nhập với Google
 *     description: Chuyển hướng đến Google để xác thực
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Xử lý callback Google SSO
 *     description: Google xác thực thành công sẽ trả về dữ liệu user
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Tạo JWT token
        const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Đăng nhập thành công", token });
    }
);
export default router;
