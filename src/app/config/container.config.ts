import 'reflect-metadata';
import { container } from 'tsyringe';
import {
  AuthService, CategoryService,
  MailService,
  OrderService,
  OtpService,
  ProductService, ShipFeeService,
  UserService,
  VoucherService,
} from '../services';
import { sequelize } from './sequelize.config';
import {
  AuthController,
  UserController,
  ProductController,
  OrderController,
  VoucherController,
  ShipFeeController,
} from '../controllers';
import CategoryController from "../controllers/category.controller";

// Register dependencies
container.register('Sequelize', { useValue: sequelize });
container.register('OtpService', { useClass: OtpService });
container.register('UserService', { useClass: UserService });
container.register('MailService', { useClass: MailService });
container.register('AuthService', { useClass: AuthService });
container.register('ProductService', { useClass: ProductService });
container.register('VoucherService', { useClass: VoucherService });
container.register('ShipFeeService', { useClass: ShipFeeService });
container.register('OrderService', { useClass: OrderService });
container.register('CategoryService', { useClass: CategoryService });

container.register('UserController', { useClass: UserController });
container.register('AuthController', { useClass: AuthController });
container.register('ProductController', { useClass: ProductController });
container.register('OrderController', { useClass: OrderController });
container.register('VoucherController', { useClass: VoucherController });
container.register('ShipFeeController', { useClass: ShipFeeController });
container.register('CategoryController', { useClass: CategoryController });

export { container };
