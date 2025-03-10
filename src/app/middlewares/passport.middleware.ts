import { ENV_CONFIG, container } from '../config';
import { MailService } from '../services';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { ROLE } from '../constants';

const mailService = container.resolve(MailService);
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV_CONFIG.google.clientId,
      clientSecret: ENV_CONFIG.google.clientSecret,
      callbackURL: ENV_CONFIG.google.redirectUrl,
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
            fullName: profile.displayName,
            password: hashedPassword,
            role: ROLE.USER,
            isActive: true, // Không cần kích hoạt
            code: null,
          });

          // Gửi email chứa mật khẩu
          await mailService.sendPassword(user.email, randomPassword);
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    },
  ),
);
// ✅ **Fix lỗi serialize & deserialize**
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user['id']); // Đảm bảo `user.id` tồn tại
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Hàm tạo mật khẩu ngẫu nhiên
const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
export default passport;
