import session from 'express-session';
import { ENV_CONFIG } from './env.config';

const SESSION_CONFIG = session({
  secret: ENV_CONFIG.jwt.secret as any, // 🔐 Thay bằng khóa bí mật của bạn
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // ❌ false nếu chạy localhost, ✅ true nếu dùng HTTPS
    httpOnly: true, // 🔒 Bảo mật, tránh XSS
    maxAge: 30 * 24 * 60 * 60 * 1000, // ⏳ Thời gian tồn tại: 30 ngay
  },
});

export { SESSION_CONFIG };
