import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config(); // Load biến môi trường

const User = db.User;
const Role = db.Role;

// ✅ Khởi tạo transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // Lấy từ biến môi trường
        pass: process.env.MAIL_PASS, // Lấy từ biến môi trường
    },
});

export class MailService {
    async sendActivationEmail(email, activationCode) {
        try {
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject: "Kích hoạt tài khoản của bạn",
                html: `
                    <h2>Chào mừng bạn đến với FashionShop!</h2>
                    <p>Nhấn vào liên kết bên dưới để kích hoạt tài khoản của bạn:</p>
                    <a href="http://yourwebsite.com/activate?code=${activationCode}">
                        Kích hoạt tài khoản
                    </a>
                    <p>Nếu bạn không yêu cầu kích hoạt, vui lòng bỏ qua email này.</p>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Email kích hoạt đã gửi tới: ${email}`);
        } catch (error) {
            console.error(`❌ Lỗi khi gửi email: ${error.message}`);
            throw new Error("Không thể gửi email kích hoạt.");
        }
    }
}
