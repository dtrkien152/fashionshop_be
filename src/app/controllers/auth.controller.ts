import { inject, injectable } from 'tsyringe';
import { AuthService, MailService, OtpService, UserService } from '../services';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ACTION } from '../constants';
import { ENV_CONFIG } from '../config';

@injectable()
class AuthController {
  constructor(@inject(AuthService) private authService: AuthService,
              @inject(MailService) private mailService: MailService,
              @inject(UserService) private userService: UserService,
              @inject(OtpService) private otpService: OtpService) {
  }

  signUp = async (req: Request, res: Response): Promise<any> => {
    try {
      if (await this.userService.isExistsEmail(req.body.email)) {
        return res.status(400).json({ message: 'Email is already in use!' });
      }
      const user = await this.authService.signup(req.body.email, req.body.password);
      const otp = await this.otpService.create(user.id, ACTION.ACTIVE_USER);
      await this.mailService.sendActivationEmail(user.get('email'), otp.code);
      res.send({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };

  signIn = async (req: Request, res: Response): Promise<any> => {
    try {
      // 🔍 Tìm user theo email
      const user = await this.userService.getByEmail(req.body.email);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // 🔑 Kiểm tra mật khẩu
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      // 🛠️ Tạo JWT Token
      const token = jwt.sign({ id: user.id }, ENV_CONFIG.jwt.secret, {
        algorithm: 'HS256',
        expiresIn: '24h', // Token hết hạn sau 24 giờ
      });

      // ✅ Lưu user vào session
      if (!req.session) {
        return res.status(500).json({ message: 'Session is not initialized!' });
      }

      req.session['user'] = {
        id: user.id,
        email: user.email,
        role: user.role, // Nếu có quyền hạn
      };
      req.session['token'] = token; // Lưu JWT vào session

      return res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role,
        token, // ✅ Trả về JWT Token
      });

    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  signOut = async (req: Request, res: Response): Promise<any> => {
    try {
      req.session = null;
      return res.status(200).send({
        message: 'You\'ve been signed out!',
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  signInWithGoogle = async (req: Request, res: Response): Promise<any> => {
    const user = req.user;
    req.session['user'] = {
      id: user['id'],
      email: user['email'],
      role: user['role'],
    };
    // Tạo JWT token
    const token = jwt.sign({ id: user['id'], email: user['email'] }, ENV_CONFIG.jwt.secret, {
      expiresIn: '24h',
    });
    req.session['token'] = token; // Lưu JWT vào session

    return res.status(200).json({
      id: user['id'],
      email: user['email'],
      role: user['role'],
      token, // ✅ Trả về JWT Token
    });
  };

  activate = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, code } = req.query;
      if (!email) {
        return res.status(400).json({ message: 'Email is required!' });
      }
      if (!code) {
        return res.status(400).json({ message: 'Invalid activation code!' });
      }
      const response = await this.authService.activate(email as string, code as string);
      res.json(response);
    } catch (error) {
      console.error('❌ Lỗi kích hoạt tài khoản:', error);
      res.status(400).json({ message: error.message });
    }
  };

  getInfo = async (req: Request, res: Response): Promise<any> => {
    if (!req.session || !req.session['user']) {
      return res.status(401).json({ message: 'User not logged in.' });
    }

    return res.status(200).json(req.session['user']);
  };
}

export default AuthController;
