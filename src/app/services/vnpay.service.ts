import { injectable } from 'tsyringe';
import { vnpay } from '../config';
import { ProductCode, VerifyReturnUrl, VnpLocale } from 'vnpay';

@injectable()
class VNPayService {
  constructor() {
  }

  buildUrlPayment(orderCode: string, amount: number, ipAddr: string) {
    return vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toan don hang ${orderCode}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `http://localhost:3000/order/tracking/${orderCode}`, // Đường dẫn nên là của frontend
      vnp_Locale: VnpLocale.VN,
    });
  }

  verifyReturnUrl(query: any) {
    const verify = vnpay.verifyReturnUrl(query) as VerifyReturnUrl;
    return {
      orderCode: verify.vnp_TxnRef,
      isVerified: verify.isVerified,
      isSuccess: verify.isSuccess,
      message: verify.message,
    };
  }

}

export default VNPayService;
