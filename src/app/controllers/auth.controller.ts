import { inject, injectable } from 'tsyringe';
import { AuthService, MailService, OtpService, UserService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { ACTION } from '../constants';
import { BadRequestError, NotFoundError } from '../errors';
import bcrypt from 'bcryptjs';

@injectable()
class AuthController {
  constructor(@inject(AuthService) private authService: AuthService,
              @inject(MailService) private mailService: MailService,
              @inject(UserService) private userService: UserService,
              @inject(OtpService) private otpService: OtpService) {
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (await this.userService.isExistsEmail(req.body.email)) {
        throw new BadRequestError('Email đã được sử dụng!');
      }
      const user = await this.authService.signUp(req.body.fullName, req.body.email, req.body.password);
      const otp = await this.otpService.create(user.id, ACTION.ACTIVE_USER);
      await this.mailService.sendOtpActivationEmail(user.get('email') as string, otp.code);
      return res.send({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;
      const data = await this.authService.signIn(email, password);
      return res.json({ ...data });
    } catch (error) {
      console.error('Login Error:', error);
      next(error);
    }
  };

  adminSignIn = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;
      const data = await this.authService.adminSignIn(email, password);
      return res.json(data);
    } catch (error) {
      console.error('Login Error:', error);
      next(error);
    }
  };

  signInWithGoogle = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
      if (!req.user) {
        return res.redirect('http://localhost:3000/login');
      }
      const user = req.user;
      const data = await this.authService.signInWithGoogle(user['email']);
      console.log('data ', data);
      // Chuyển hướng về frontend kèm theo JWT token
      res.redirect(`http://localhost:3000/login?token=${data?.token}`);
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      res.redirect('http://localhost:3000/login');
    }

    // try {
    //   const user = req.user;
    //   const data = this.authService.signInWithGoogle(user['email']);
    //   return res.json({ ...data });
    // } catch (error) {
    //   next(error);
    // }
  };

  activate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, code } = req.query;
      if (!email) throw new BadRequestError('Email is required!');
      if (!code) throw new BadRequestError('Invalid activation code!');
      await this.authService.activate(email as string, code as string);
      return res.json({ message: 'Tài khoản đã được kích hoạt thành công!' });
    } catch (error) {
      console.error('❌ Lỗi kích hoạt tài khoản:', error);
      next(error);
    }
  };

  changeMyPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.session;
      const { oldPassword, newPassword } = req.body;
      await this.userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      next(error);
    }
  };

  changeEmployeePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.session;
      const { oldPassword, newPassword } = req.body;
      await this.userService.changeEmployeePassword(userId, oldPassword, newPassword);
      res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      next(error);
    }
  };

  sendMailForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      const user = await this.userService.getByEmail(email as string);
      if (!user) {
        throw new BadRequestError('Email không tồn tại');
      }
      const otp = await this.otpService.create(user.id, ACTION.FORGOT_PASSWORD);
      await this.mailService.sendOtpForgotPassword(email as string, otp.code);
      res.status(200).json({ success: true, message: 'Mã OTP đã được gửi tới email của bạn' });
    } catch (error) {
      next(error);
    }
  };

  resetForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, code, newPassword } = req.body;
      // Tìm user với mã kích hoạt
      const user = await this.userService.getByEmail(email);

      if (!user) {
        throw new NotFoundError('Tài khoản không tồn tại!');
      }

      const verify = await this.otpService.verify(user.id, code, ACTION.FORGOT_PASSWORD);

      if (!verify) {
        throw new BadRequestError('Mã kích hoạt không hợp lệ!');
      }
      await user.update({ password: bcrypt.hashSync(newPassword, 8) });
      res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
