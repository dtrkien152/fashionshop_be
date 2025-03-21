import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { ENV_CONFIG, TRANSPORTER } from '../config';
import { IOrder } from '../models';
import { OrderProduct } from '../dto/order.dto';

@injectable()
class MailService {
  private transporter: nodemailer.Transporter;
  private LOGO_URL: string = '';

  constructor() {
    this.transporter = TRANSPORTER;
  }

  sendOtpActivationEmail = async (email: string, otp: string) => {
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

  sendOtpForgotPassword = async (email: string, otp: string) => {
    try {
      const mailOptions = {
        from: ENV_CONFIG.mail.user,
        to: email,
        subject: 'Thay đổi mật khẩu tài khoản của bạn',
        html: `
                    <h2>Chào mừng bạn đến với FashionShop!</h2>
                    <p>Nhấn vào liên kết bên dưới để đổi mật khẩu tài khoản của bạn:</p>
                    <a href="http://localhost:3000/forgot-password/change-password?email=${email}&code=${otp}">
                        Thay đổi mật khâẩu
                    </a>
                    <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email thay đổi mật khẩu đã gửi tới: ${email}`);
    } catch (error) {
      console.error(`❌ Lỗi khi gửi email: ${error.message}`);
      throw new Error('Không thể gửi email thay đổi mật khẩu.');
    }
  };

  sendConfirmOrder = async (email: string, order: IOrder, orderDetails: OrderProduct[]) => {
    try {
      const originTotalPrice = orderDetails.reduce((acc, cur) => acc + (cur.unit * cur.priceInUnit), 0);
      const itemList = orderDetails.map(item => `
          <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.unit}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(item.unit * item.priceInUnit)} VND</td>
          </tr>
      `).join('');

      // Nội dung email dạng HTML
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
            <div style="text-align: center;">
                <img src="${this.LOGO_URL}" alt="Cửa hàng XYZ" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            
            <h2 style="color: #3498db; text-align: center;">Xác nhận đơn hàng thành công</h2>
            <p>Xin chào <b>${order.customerName}</b>,</p>
            <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi! Dưới đây là thông tin đơn hàng của bạn:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background-color: #f8f8f8;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Sản phẩm</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Số lượng</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Giá</th>
                </tr>
                ${itemList}
            </table>

            <h3 style="margin-top: 20px;">Chi tiết thanh toán</h3>
            <p>🛒 <b>Tổng tiền hàng:</b> ${originTotalPrice} VND</p>
            ${order.voucherCode ? `<p>🎟 <b>Voucher (${order.voucherCode}):</b> -${originTotalPrice - order.totalPrice} VND</p>` : ''}
            <p>🚚 <b>Phí vận chuyển:</b> ${order.shipFee} VND</p>
            <h3 style="color: #e74c3c; text-align: right; margin-top: 10px;">💰 Tổng thanh toán: ${order.totalPrice + order.shipFee} VND</h3>

            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:3000/order/tracking/${order.code}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                    Theo dõi đơn hàng
                </a>
            </div>

            <p style="margin-top: 20px;">Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
            <p>Trân trọng,</p>
            <p><b>Cửa hàng XYZ</b></p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác nhận đơn hàng thành công',
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Xác nhận đơn hàng đã gửi tới: ${email}`);
    } catch (error) {
      console.error(`❌ Lỗi khi gửi email: ${error.message}`);
      throw new Error('Không thể gửi email xác nhận đơn hàng.');
    }
  };
}

export default MailService;
