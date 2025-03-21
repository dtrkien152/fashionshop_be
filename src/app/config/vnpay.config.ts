import { ignoreLogger, VNPay } from 'vnpay';
import { ENV_CONFIG } from './env.config';

export const vnpay = new VNPay({
  tmnCode: ENV_CONFIG.vnpay.tmnCode,
  secureSecret: ENV_CONFIG.vnpay.hashSecret,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true

  /**
   * Bật/tắt ghi log
   * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
   */
  enableLog: true, // tùy chọn

  /**
   * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
   * Mặc định, loggerFn sẽ ghi log ra console
   * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
   *
   * `ignoreLogger` là một hàm không làm gì cả
   */
  loggerFn: ignoreLogger, // tùy chọn
});
