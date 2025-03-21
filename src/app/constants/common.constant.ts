export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum ACTION {
  ACTIVE_USER = 'ACTIVE_USER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum SORT_BY_ENUM {
  NEWEST = 'newest',
  LATEST = 'latest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc'
}

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  RETURN = 'RETURN',
}

export enum PAYMENT_TYPE {
  VNPAY = 'VNPAY',
  COD = 'COD'
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}
export const IMAGE_DEFAULT='https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif'
