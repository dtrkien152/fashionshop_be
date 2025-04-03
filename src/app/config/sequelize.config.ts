import { Sequelize } from 'sequelize-typescript';
import { ENV_CONFIG } from './env.config';
import {
  Post,
  PostCategory,
  Cart,
  CartDetail,
  Category,
  CategoryEvent,
  Comment,
  Event,
  Notify,
  Order,
  OrderDetail,
  Otp,
  Payment,
  Product,
  ProductSubDetail,
  ReturnOrder,
  ShipFee,
  ShipInfo,
  Site,
  Stock,
  Tags,
  User,
  UserAddress,
  UserVoucher,
  Voucher,
} from '../models';

const sequelize = new Sequelize(
  ENV_CONFIG.db.name as string,
  ENV_CONFIG.db.user as string,
  ENV_CONFIG.db.password,
  {
    host: ENV_CONFIG.db.host,
    port: +(ENV_CONFIG.db.port || 3306),
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log,
    define: {
      timestamps: true, // Bật timestamps
      underscored: true, // camelCase -> snake_case
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    models: [
      Post, PostCategory, Cart, CartDetail, Category, CategoryEvent, Comment, Event,
      Notify, Order, OrderDetail, Otp, Payment, Product, ProductSubDetail, ShipFee,
      ReturnOrder, ShipInfo, Site, Stock, Tags, User, UserAddress, UserVoucher, Voucher,
    ],
  },
);

export { sequelize };
