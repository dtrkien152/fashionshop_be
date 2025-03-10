import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { ENV_CONFIG, TRANSPORTER } from '../config';

@injectable()
class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = TRANSPORTER;
  }

  sendActivationEmail = async (email: string, otp: string) => {
    try {
      const mailOptions = {
        from: ENV_CONFIG.mail.user,
        to: email,
        subject: 'Kích hoạt tài khoản của bạn',
        html: `
                    <h2>Chào mừng bạn đến với FashionShop!</h2>
                    <p>Nhấn vào liên kết bên dưới để kích hoạt tài khoản của bạn:</p>
                    <a href="http://localhost:5000/api/auth/activate?email=${email}&code=${otp}">
                        Kích hoạt tài khoản
                    </a>
                    <p>Nếu bạn không yêu cầu kích hoạt, vui lòng bỏ qua email này.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email kích hoạt đã gửi tới: ${email}`);
    } catch (error) {
      console.error(`❌ Lỗi khi gửi email: ${error.message}`);
      throw new Error('Không thể gửi email kích hoạt.');
    }
  };

  sendPassword = async (email: string, password: string) => {
    try {
      const mailOptions = {
        from: ENV_CONFIG.mail.user,
        to: email,
        subject: 'Thông tin tài khoản của bạn',
        html: `
                    <h2>Chào mừng bạn đến với FashionShop!</h2>
                    <p>Tài khoản của bạn đã được tạo khi đăng nhập bằng Google.</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Mật khẩu:</b> ${password}</p>
                    <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email chứa mật khẩu đã gửi tới: ${email}`);
    } catch (error) {
      console.error(`❌ Lỗi khi gửi email: ${error.message}`);
      throw new Error('Không thể gửi email chứa mật khẩu.');
    }
  };

}

export default MailService;
