import db from "../models/index.js"; // Import models

const User = db.User;

class UserService {
    /**
     * Cập nhật thông tin cá nhân của user (trừ địa chỉ)
     * @param {number} userId - ID của user cần cập nhật
     * @param {object} updatedData - Dữ liệu mới để cập nhật (email, full_name, gender, phone, avatar)
     * @returns {Promise<object>} - Thông tin user đã được cập nhật
     */
    static async updateUserProfile(userId, updatedData) {
        try {
            // Chỉ cho phép cập nhật các trường sau
            const allowedFields = ["full_name", "gender", "phone"];
            const filteredData = Object.fromEntries(
                Object.entries(updatedData).filter(([key]) => allowedFields.includes(key))
            );

            // Tìm user theo ID
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User không tồn tại!");
            }

            // Cập nhật thông tin user
            await user.update(filteredData);

            return user;
        } catch (error) {
            console.error("Lỗi khi cập nhật user:", error);
            throw new Error("Không thể cập nhật thông tin user!");
        }
    }


    /**
     * Lấy thông tin cơ bản của user theo ID
     * @param {number} userId - ID của user
     * @returns {Promise<object>} - Thông tin cơ bản của user hoặc null nếu không tìm thấy
     */
    static async UserInforByID(userId) {
        try {
            const user = await User.findOne({
                where: { id: userId },
                attributes: ["id", "email", "full_name", "gender", "phone", "avatar", "is_active"],
            });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
            throw new Error("Không thể lấy thông tin user.");
        }
    }
}

export default UserService;
