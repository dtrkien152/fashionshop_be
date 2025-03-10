import express from 'express';
import { container } from '../config';
import { AuthController } from '../controllers';
import { corsMiddleware, passportMiddleware } from '../middlewares';

const router = express.Router();
const authController = container.resolve(AuthController);
// Middleware CORS
router.use(corsMiddleware.addHeaderResponse);
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/sign-up:
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
router.post('/sign-up', authController.signUp);

/**
 * @swagger
 * /api/auth/sign-in:
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/sign-in', authController.signIn);

/**
 * @swagger
 * /api/auth/activate:
 *   get:
 *     summary: Kích hoạt tài khoản người dùng
 *     tags:
 *       - Auth
 *     description: API này được sử dụng để kích hoạt tài khoản bằng mã kích hoạt
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Mã kích hoạt của người dùng
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         description: Email người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kích hoạt thành công
 *       400:
 *         description: Mã kích hoạt không hợp lệ hoặc đã hết hạn
 */
router.get('/activate', authController.activate);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Đăng nhập với Google
 *     description: Chuyển hướng đến Google để xác thực
 */
router.get('/google', passportMiddleware.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Xử lý callback Google SSO
 *     description: Google xác thực thành công sẽ trả về dữ liệu user
 */
router.get(
  '/google/callback',
  passportMiddleware.authenticate('google', { failureRedirect: '/login' }),
  authController.signInWithGoogle,
);

/**
 * @swagger
 * /api/auth/getAccount:
 *   get:
 *     summary: Lấy thông tin user từ session
 *     tags: [Auth]
 *     description: API này trả về thông tin người dùng đang đăng nhập thông qua session.
 */
router.get('/getAccount', authController.getInfo);

export default router;
