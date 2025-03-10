import db from "../models/index.js";

const { user: User, role: Role } = db;


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
}
