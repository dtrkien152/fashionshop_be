import { delay, inject, injectable } from 'tsyringe';
import { IUser, User } from '../models';
import bcrypt from 'bcryptjs';
import { ACTION, ROLE } from '../constants';
import { GenerateUtils } from '../utils';
import { OtpService, UserService } from '../services';
import jwt, { JwtPayload, VerifyCallback } from 'jsonwebtoken';
import { ENV_CONFIG } from '../config';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';

@injectable()
class AuthService {
  constructor(@inject(delay(() => OtpService)) private otpService: OtpService,
              @inject(delay(() => UserService)) private userService: UserService) {
  }

  getRole = async (userId: number) => {
    try {
      const user = await User.findByPk(userId);
      return user?.role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw new Error('Error fetching user role');
    }
  };

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

  decodeToken = (token: string, callback?: VerifyCallback<JwtPayload | string>) => {
    return jwt.verify(token, ENV_CONFIG.jwt.secret, { issuer: ENV_CONFIG.jwt.issuer }, callback);
  };

  signIn = async (email: string, password: string) => {
    // 🔍 Tìm user theo email
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedError('Invalid password!');
    }

    // 🛠️ Tạo JWT Token
    const token = this.createToken(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
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
      token,
    };
  };

  signUp = async (email: string, password: string) => {
    // Tạo mã kích hoạt ngẫu nhiên
    return await User.create({
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
