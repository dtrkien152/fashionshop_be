import { delay, inject, injectable } from 'tsyringe';
import { IEmployee, IUser, User } from '../models';
import bcrypt from 'bcryptjs';
import { ACTION, ROLE } from '../constants';
import { GenerateUtils } from '../utils';
import { EmployeeService, OtpService, UserService } from '../services';
import jwt, { JwtPayload, VerifyCallback } from 'jsonwebtoken';
import { ENV_CONFIG } from '../config';
import { BadRequestError, NotFoundError } from '../errors';

@injectable()
class AuthService {
  constructor(@inject(delay(() => OtpService)) private otpService: OtpService,
              @inject(delay(() => UserService)) private userService: UserService,
              @inject(delay(() => EmployeeService)) private employeeService: EmployeeService) {
  }

  createToken = (user: IUser) => {
    return jwt.sign({
      role: user.role,
      email: user.email,
    }, ENV_CONFIG.jwt.secret, {
      jwtid: GenerateUtils.uuid(),
      subject: user.id.toString(),
      issuer: ENV_CONFIG.jwt.issuer,
      algorithm: 'HS256',
      expiresIn: '24h', // Token hết hạn sau 24 giờ
    });
  };

  createAdminToken = (employee: IEmployee) => {
    return jwt.sign({
      role: employee.role,
      email: employee.email,
    }, ENV_CONFIG.jwt.secret, {
      jwtid: GenerateUtils.uuid(),
      subject: employee.id.toString(),
      issuer: ENV_CONFIG.jwt.issuer,
      algorithm: 'HS256',
      expiresIn: '24h', // Token hết hạn sau 24 giờ
    });
  };

  decodeToken = (token: string, callback?: VerifyCallback<JwtPayload | string>) => {
    return jwt.verify(token, ENV_CONFIG.jwt.secret, { issuer: ENV_CONFIG.jwt.issuer }, callback);
  };

  signIn = async (email: string, password: string) => {
    // 🔍 Tìm user theo email
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError('Bạn đã nhập sai email');
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new NotFoundError('Bạn đã nhập sai password');
    }

    // 🛠️ Tạo JWT Token
    const token = this.createToken(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      token,
      fullName: user.fullName,
    };
  };

  adminSignIn = async (email: string, password: string) => {
    // 🔍 Tìm user theo email
    const employee = await this.employeeService.getByEmail(email);

    if (!employee) {
      throw new NotFoundError('Bạn đã nhập sai email');
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(password, employee.password);
    if (!passwordIsValid) {
      throw new NotFoundError('Bạn đã nhập sai password');
    }

    // 🛠️ Tạo JWT Token
    const token = this.createAdminToken(employee);

    return {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      fullName: employee.fullName,
      dob:employee.dob,
      address:employee.address,
      gender:employee.gender,
      avatar:employee.avatar,
      token,
    };
  };

  signInWithGoogle = async (email: string) => {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    // 🛠️ Tạo JWT Token
    const token = this.createToken(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      token,
      fullName: user.fullName,
    };
  };

  signUp = async (fullName: string, email: string, password: string) => {
    return await User.create({
      fullName: fullName,
      email: email,
      password: bcrypt.hashSync(password, 8),
      role: ROLE.USER,
      isActive: false,
      code: GenerateUtils.code('USR', 12),
    });
  };

  activate = async (email: string, code: string) => {
    // Tìm user với mã kích hoạt
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError('Tài khoản không tồn tại!');
    }

    const verify = await this.otpService.verify(user.id, code, ACTION.ACTIVE_USER);

    if (!verify) {
      throw new BadRequestError('Mã kích hoạt không hợp lệ!');
    }

    // Cập nhật trạng thái active
    user.isActive = true;
    await user.save();
  };
}

export default AuthService;
