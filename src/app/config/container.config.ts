import 'reflect-metadata';
import {container} from 'tsyringe';
import {AuthService, MailService, OtpService, ProductService, UserService} from "../services";
import {sequelize} from './sequelize.config';
import {AuthController, UserController,ProductController} from "../controllers";

// Register dependencies
container.register('Sequelize', {useValue: sequelize});
container.register('OtpService', {useClass: OtpService});
container.register('UserService', {useClass: UserService});
container.register('MailService', {useClass: MailService});
container.register('AuthService', {useClass: AuthService});
container.register('ProductService', {useClass: ProductService});

container.register('UserController', {useClass: UserController});
container.register('AuthController', {useClass: AuthController});
container.register('ProductController', {useClass: ProductController});

export {container};
