import { delay, inject, injectable } from 'tsyringe';
import {User} from "../models";
import bcrypt from "bcryptjs";
import {ACTION, ROLE} from "../constants";
import {GenerateUtils} from "../utils";
import {OtpService, UserService} from "../services";

@injectable()
class AuthService {
    constructor(@inject(delay(() => OtpService)) private otpService: OtpService,
                @inject(delay(() => UserService)) private userService: UserService) {
    }

    getRole = async (userId: number) => {
        try {
            const user = await User.findByPk(userId);

            return user?.role;
        } catch (error) {
            console.error("Error fetching user role:", error);
            throw new Error("Error fetching user role");
        }
    }

    signup = async (email: string, password: string) => {
        // Tạo mã kích hoạt ngẫu nhiên
        return await User.create({
            email: email,
            password: bcrypt.hashSync(password, 8),
            role: ROLE.USER,
            isActive: false,
            code: GenerateUtils.code('USR', 12)
        });
    }

    activate = async (email: string, code: string) => {
        // Tìm user với mã kích hoạt
        const user = await this.userService.getByEmail(email);

        if (!user) {
            throw new Error("Tài khoản không tồn tại!");
        }

        const verify = await this.otpService.verify(user.id, code, ACTION.ACTIVE_USER);

        if (!verify) {
            throw new Error("Mã kích hoạt không hợp lệ!");
        }

        // Cập nhật trạng thái active
        user.isActive = true;
        await user.save();

        return {message: "Tài khoản đã được kích hoạt thành công!"};
    }
}

export default AuthService;
