import express from "express";
import {verifySignUp, passport} from "../middleware/index.js";
import * as controller from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import {ROLE_USER} from "../constant/constant.js";
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
 *     tags: [Auth]
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
 *     tags: [Auth]
 *     summary: Đăng nhập với Google
 *     description: Chuyển hướng đến Google để xác thực
 */
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Xử lý callback Google SSO
 *     description: Google xác thực thành công sẽ trả về dữ liệu user
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {failureRedirect: "/login"}),
    (req, res) => {
        const user = req.user;
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role || ROLE_USER,
        };
        // Tạo JWT token
        const token = jwt.sign({id: req.user.id, email: req.user.email}, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token, // ✅ Trả về JWT Token
        });
        res.json({message: "Đăng nhập thành công", token});
    }
);
/**
 * @swagger
 * /api/auth/getAccount:
 *   get:
 *     summary: Lấy thông tin user từ session
 *     tags: [Auth]
 *     description: API này trả về thông tin người dùng đang đăng nhập thông qua session.
 */
router.get("/getAccount", controller.getAccount);
export default router;
