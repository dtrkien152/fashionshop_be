import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { MailService } from "../services/mailService.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const mailService = new MailService();
const User=db.User;
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ where: { email: profile.emails[0].value } });

                if (!user) {
                    // Người dùng chưa tồn tại => Tạo mật khẩu ngẫu nhiên
                    const randomPassword = generateRandomPassword();
                    const hashedPassword = bcrypt.hashSync(randomPassword, 8);

                    // Tạo user mới
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        avatar: profile.photos[0].value,
                        password: hashedPassword,
                        role_id: 2, // Giả sử role 2 là USER
                        is_active: true, // Không cần kích hoạt
                        code: null,
                    });

                    // Gửi email chứa mật khẩu
                    await mailService.sendPassword(user.email,randomPassword);
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
// ✅ **Fix lỗi serialize & deserialize**
passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user.id); // Đảm bảo `user.id` tồn tại
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Hàm tạo mật khẩu ngẫu nhiên
const generateRandomPassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};
export default passport