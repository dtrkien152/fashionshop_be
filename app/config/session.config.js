import session from "express-session";

const sessionConfig = session({
    secret: "your_secret_key", // 🔐 Thay bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // ❌ false nếu chạy localhost, ✅ true nếu dùng HTTPS
        httpOnly: true, // 🔒 Bảo mật, tránh XSS
        maxAge: 30*24 * 60 * 60 * 1000, // ⏳ Thời gian tồn tại: 30 ngay
    },
});

export default sessionConfig;
