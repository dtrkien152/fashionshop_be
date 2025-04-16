import { injectable } from 'tsyringe';
import axios from 'axios';
import { ENV_CONFIG } from '../config';
import { CreateOrderGhnRequest, OrderDto } from '../dto';

@injectable()
class GhnService {
  axios: any;

  constructor() {
    this.axios = axios;
    this.axios.interceptors.request.use(
      function(config: any) {
        config.headers = {
          'Content-Type': 'application/json',
          Token: ENV_CONFIG.ghn.token,
          ShopId: ENV_CONFIG.ghn.shopId,
        };
        return config;
      },
      function(error: any) {
        return Promise.reject(error);
      },
    );
  }

  async createOrderShipping(order: OrderDto, weight: number, width: number, height: number) {
    const payload: CreateOrderGhnRequest = {
      payment_type_id: 1,
      service_type_id: 2,
      required_note: 'CHOXEMHANGKHONGTHU',
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
    return await this.axios.post(ENV_CONFIG.ghn.baseUrl + '/v2/shipping-order/create', payload);
  }

  async getProvince() {
    // return await this.axios.get(ENV_CONFIG.ghn.baseUrl + '/master-data/province');
    return await this.axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province');
  }

  async getWard(districtId: number) {
    // return await this.axios.get(ENV_CONFIG.ghn.baseUrl + '/master-data/ward?district_id='+districtId);
    return await this.axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id='+districtId);
  }

  async getDistrict(provinceId: number) {
    // return await this.axios.get(ENV_CONFIG.ghn.baseUrl + '/master-data/district?province_id='+provinceId);
    return await this.axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id='+provinceId);
  }
}

export default GhnService;