import express from 'express';
import { container, ENV_CONFIG } from '../config';
import { AuthController, UserController } from '../controllers';
import { passportMiddleware } from '../middlewares';
import { jwtMiddleware } from '../middlewares';
import passport from 'passport';

const router = express.Router();
const authController = container.resolve(AuthController);
const userController = container.resolve(UserController);

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
 *               fullName:
 *                 type: string
 *                 example: "Nguyen Hoang Dinh"
 *               email:
 *                 type: string
 *                 example: "hapego8519@calmpros.com"
 *               password:
 *                 type: "string"
 *                 example: "Vebo123$%^"
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
 *                 example: "hapego8519@calmpros.com"
 *               password:
 *                 type: "string"
 *                 example: "Vebo123$%^"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/sign-in', authController.signIn);

/**
 * @swagger
 * /api/auth/admin/sign-in:
 *   post:
 *     summary: Đăng nhập hệ thống quản trị
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
 *                 example: "hapego8519@calmpros.com"
 *               password:
 *                 type: "string"
 *                 example: "Vebo123$%^"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/admin/sign-in', authController.adminSignIn);

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
 *           example: 841852
 *       - in: query
 *         name: email
 *         required: true
 *         description: Email người dùng
 *         schema:
 *           type: string
 *           example: "hapego8519@calmpros.com"
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
  passport.authenticate('google', {
    failureRedirect: `${ENV_CONFIG.server.shopBaseUrl}/login`,
    session: false, // Đặt session false nếu dùng JWT thay vì cookie
  }),
  authController.signInWithGoogle,
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin người dùng hiện tại (Google SSO)
 *     description: API này trả về thông tin người dùng sau khi xác thực thành công bằng Google SSO.
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 */
router.get('/me', jwtMiddleware.verifyUserToken, userController.getUserProfile);

/**
 * @swagger
 * /api/auth/admin/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin người dùng quản trị hiện tại
 *     description: API này trả về thông tin người dùng quản trị sau khi xác thực thành công bằng Google SSO.
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 */
router.get('/admin/me', jwtMiddleware.verifyEmployeeToken, userController.getUserAdminProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad request, possibly invalid input.
 *       401:
 *         description: Unauthorized, user not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.put('/change-password', jwtMiddleware.verifyUserToken, authController.changeMyPassword);
router.put('/employee/change-password', jwtMiddleware.verifyUserToken, authController.changeEmployeePassword);

/**
 * @swagger
 * /api/auth/forgot-password/send-mail:
 *   get:
 *     summary: Request a password reset OTP
 *     description: Sends an OTP to the user's email for password reset.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email address associated with the user account.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, possibly invalid email.
 *       404:
 *         description: User with the provided email not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password/send-mail', authController.sendMailForgotPassword);
/**
 * @swagger
 * /api/auth/forgot-password/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     description: Allows a user to reset their password using an OTP received via email.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               code:
 *                 type: string
 *                 description: The OTP code received via email.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Bad request, possibly invalid OTP or email.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/forgot-password/reset-password', authController.resetForgotPassword);

export default router;
