import { injectable } from 'tsyringe';
import axios from 'axios';
import { ENV_CONFIG } from '../config';
import { CreateOrderGhnRequest, OrderDto } from '../dto';

@injectable()
class GhnService {
  axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: ENV_CONFIG.ghn.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Token: ENV_CONFIG.ghn.token,
        ShopId: ENV_CONFIG.ghn.shopId,
      },
    });
  }

  async createOrderShipping(order: OrderDto, weight: number, width: number, height: number) {
    const payload: CreateOrderGhnRequest = {
      payment_type_id: 1,
      service_type_id: 2,
      required_note: 'Đồng kiểm hàng',
      from_name: 'Vebo Shop',
      from_phone: '0919737083',
      from_address: '10 Hồ Tùng Mậu, Hà Nội, Việt Nam',
      from_ward_name: 'Phường Mai Dịch',
      from_district_name: 'Quận Cầu Giấy',
      from_province_name: 'Hà Nội',
      to_name: order.customerName,
      to_phone: order.customerPhone,
      to_address: order.customerAddress,
      to_ward_code: '20308',
      to_district_id: 1444,
      cod_amount: order.totalPrice,
      weight: weight,
      length: 1,
      width: width,
      height: height,
      items: order.products.map((el) => ({
        name: `${el.productName} - ${el.color} - ${el.size}`,
        quantity: el.unit,
      })),
    };
    return await this.axios.post('/shipping-order/create', payload);
  }
}

export default GhnService;