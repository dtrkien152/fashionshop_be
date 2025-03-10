import db from "../models/index.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const User = db.User;
const Role = db.Role;

export class AuthService {
    async getRole(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: { model: Role, as: "role" },
            });

            return user?.role?.name || null;
        } catch (error) {
            console.error("Error fetching user role:", error);
            throw new Error("Error fetching user role");
        }
    }

    async signup(email, password, roleName) {
        let roleId = 1; // Mặc định role là 1 nếu không có role trong request
        if (roleName) {
            const role = await Role.findOne({
                where: { name: roleName },
            });

            if (role) {
                roleId = role.id;
            }
        }
        // Tạo mã kích hoạt ngẫu nhiên
        const activationCode = this.generateRandomCode();
        const user = await User.create({
            email: email,
            password: bcrypt.hashSync(password, 8),
            role_id: roleId, // Gán roleId trực tiếp,
            is_active: false,
            code:activationCode
        });
        return user;
    }

     generateRandomCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

}
