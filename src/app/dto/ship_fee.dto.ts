export interface ShipFeeCreateRequest {
  name?: string;
  triggerPrice?: number;
  fee?: number;
}

export interface ShipFeeUpdateRequest {
  id: number;
}
