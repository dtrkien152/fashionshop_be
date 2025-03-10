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
 * /api/user/test/all:
 *   get:
 *     description: Truy cập công khai
 */
router.get("/test/all", controller.allAccess);

/**
 * @swagger
 * /api/user/test/user:
 *   get:
 *     description: Truy cập yêu cầu đăng nhập
 */
router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

/**
 * @swagger
 * /api/user/test/mod:
 *   get:
 *     description: Truy cập yêu cầu quyền Moderator
 */
router.get("/test/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

/**
 * @swagger
 * /api/user/test/admin:
 *   get:
 *     description: Truy cập yêu cầu quyền Admin
 */
router.get("/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

export default router;
