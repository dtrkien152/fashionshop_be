import db from "../models/index.js";

class VerifySignUpService {
  constructor() {
    this.ROLE = db.Role;
  }

  // ✅ Kiểm tra username & email trùng lặp
  async checkDuplicateUsernameOrEmail(req, res, next) {
    try {
      // console.log("DB Keys:", Object.keys(db)); // Debug DB keys
      // console.log("User Model in VerifySignUpService:", db.User);
      // console.log("FindOne Function Exists:", db.User?.findOne);

      if (!db.User) {
        return res.status(500).json({ message: "Database error: User model not found" });
      }

      const { username, email } = req.body;

      // Kiểm tra username
      const userByUsername = await db.User.findOne({ where: { username } });
      if (userByUsername) {
        return res.status(400).json({ message: "Failed! Username is already in use!" });
      }

      // Kiểm tra email
      const userByEmail = await db.User.findOne({ where: { email } });
      if (userByEmail) {
        return res.status(400).json({ message: "Failed! Email is already in use!" });
      }

      next();
    } catch (error) {
      console.error("Error in checkDuplicateUsernameOrEmail:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  // ✅ Kiểm tra role có tồn tại không
  checkRolesExisted(req, res, next) {
    const { roles } = req.body;

    if (roles) {
      for (const role of roles) {
        if (!this.ROLE.includes(role)) {
          return res.status(400).json({ message: `Failed! Role does not exist: ${role}` });
        }
      }
    }

    next();
  }
}

// ✅ Tạo instance để dùng như service
const verifySignUpService = new VerifySignUpService();
export default verifySignUpService;
