export interface CreateOrderGhnRequest {
  payment_type_id: number;
  note?: string;
  required_note: string;
  from_name: string;
  from_phone: string;
  from_address: string;
  from_ward_name: string;
  from_district_name: string;
  from_province_name: string;
  return_phone?: string;
  return_address?: string;
  return_district_id?: null;
  return_ward_code?: string;
  client_order_code?: string;
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string;
  to_district_id: number;
  cod_amount: number;
  content?: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  pick_station_id?: number;
  deliver_station_id?: number;
  insurance_value?: number;
  service_id?: number;
  service_type_id: number;
  coupon?: string;
  pick_shift?: number[];
  items: ProductGhn[];
}

export interface ProductGhn {
  name: string;
  code?: string;
  quantity: number;
  price?: number;
  length?: number;
  weight?: number;
}
