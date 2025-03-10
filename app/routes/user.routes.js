const express = require("express");
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const router = express.Router();

// Middleware CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// Public route
router.get("/test/all", controller.allAccess);

// User route (cần login)
router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

// Moderator route (cần quyền mod)
router.get("/test/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

// Admin route (cần quyền admin)
router.get("/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

module.exports = router;
