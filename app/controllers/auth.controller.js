import { AuthService } from "../services/authService.js";
import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.User;
const Role = db.Role;
export const signup = async (req, res) => {
  try {

    let roleId = 1; // Mặc định role là 1 nếu không có role trong request

    if (req.body.role) {
      const role = await Role.findOne({
        where: { name: req.body.role },
      });

      if (role) {
        roleId = role.id;
      }
    }

    // Tạo user với roleId
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role_id: roleId, // Gán roleId trực tiếp
    });

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

// export const signin = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         username: req.body.username,
//       },
//     });
//
//     if (!user) {
//       return res.status(404).send({ message: "User Not found." });
//     }
//
//     const passwordIsValid = bcrypt.compareSync(
//       req.body.password,
//       user.password
//     );
//
//     if (!passwordIsValid) {
//       return res.status(401).send({
//         message: "Invalid Password!",
//       });
//     }
//
//     const token = jwt.sign({ id: user.id },
//                            config.secret,
//                            {
//                             algorithm: 'HS256',
//                             allowInsecureKeySizes: true,
//                             expiresIn: 86400, // 24 hours
//                            });
//
//     let authorities = [];
//     const roles = await user.getRole();
//     authorities.push("ROLE_" + roles.role_name);
//
//     // roles.role_name;
//     // for (let i = 0; i < roles.length; i++) {
//     //   authorities.push("ROLE_" + roles[i].name.toUpperCase());
//     // }
//     if (!req.session) {
//       return res.status(500).send({ message: "Session is not initialized!" });
//     }
//
//     req.session.token = token;
//
//     return res.status(200).send({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       roles: authorities,
//     });
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// };

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

