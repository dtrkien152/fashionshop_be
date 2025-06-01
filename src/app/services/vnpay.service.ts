import { injectable } from 'tsyringe';
import { ENV_CONFIG, vnpay } from '../config';
import { dateFormat, getDateInGMT7, ProductCode, Refund, VerifyReturnUrl, VnpLocale, VnpTransactionType } from 'vnpay';
import { OrderDto } from '../dto';
import { IOrder } from '../models';

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
      vnp_ReturnUrl: `${ENV_CONFIG.server.shopBaseUrl}/vnpay/results`, // Đường dẫn nên là của frontend
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

  refund(order: OrderDto | IOrder, ipAddr: string) {
    const refundRequestDate = dateFormat(getDateInGMT7(new Date()));
    const orderCreatedAt = dateFormat(getDateInGMT7(order.createdAt));
    return vnpay.refund({
      vnp_Amount: order.originTotalPrice + order.shipFee - order.voucherDiscountPrice,
      vnp_CreateBy: 'Vebo Shop',
      vnp_CreateDate: refundRequestDate,
      vnp_IpAddr: ipAddr,
      vnp_OrderInfo: 'Mã đơn hàng: ' + order.code,
      vnp_RequestId: `REF_${new Date().getDate()}`,
      vnp_TransactionDate: orderCreatedAt,
      vnp_TransactionType: VnpTransactionType.FULL_REFUND,
      vnp_TxnRef: order.code,
      vnp_Locale: VnpLocale.EN,
    } as Refund);
  }

}

export default VNPayService;
