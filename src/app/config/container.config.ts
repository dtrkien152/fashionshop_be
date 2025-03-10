import 'reflect-metadata';
import {container} from 'tsyringe';
import {AuthService, MailService, OtpService, UserService} from "../services";
import {sequelize} from './sequelize.config';
import {AuthController, UserController} from "../controllers";

// Register dependencies
container.register('Sequelize', {useValue: sequelize});
container.register('OtpService', {useClass: OtpService});
container.register('UserService', {useClass: UserService});
container.register('MailService', {useClass: MailService});
container.register('AuthService', {useClass: AuthService});

container.register('UserController', {useClass: UserController});
container.register('AuthController', {useClass: AuthController});

export {container};
