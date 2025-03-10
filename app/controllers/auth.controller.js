import {AuthService} from "../services/authService.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {ROLE_USER} from "../constant/constant.js";
import {MailService} from "../services/mailService.js";

const authService = new AuthService(); // Khởi tạo instance
const mailService=new MailService();
export const signup = async (req, res) => {
  try {

    const user = await authService.signup(req.body.email, req.body.password, req.body.role_id, ROLE_USER);
    await mailService.sendActivationEmail(user.get("email"), user.get("code"));
    res.send({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: error.message });
  }
};
export const signin = async (req, res) => {
  try {
    // 🔍 Tìm user theo username
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // 🛠️ Tạo JWT Token
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      expiresIn: "24h", // Token hết hạn sau 24 giờ
    });

    // ✅ Lưu user vào session
    if (!req.session) {
      return res.status(500).json({ message: "Session is not initialized!" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role, // Nếu có quyền hạn
    };

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token, // ✅ Trả về JWT Token
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};

