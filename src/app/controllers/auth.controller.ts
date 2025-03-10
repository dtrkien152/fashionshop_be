import { inject, injectable } from 'tsyringe';
import { AuthService, MailService, OtpService, UserService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { ACTION } from '../constants';
import { BadRequestError } from '../errors';

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
        throw new BadRequestError('Email is already in use!');
      }
      const user = await this.authService.signUp(req.body.fullName, req.body.email, req.body.password);
      const otp = await this.otpService.create(user.id, ACTION.ACTIVE_USER);
      await this.mailService.sendActivationEmail(user.get('email'), otp.code);
      return res.send({ message: 'User registered successfully!' });
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

  signInWithGoogle = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const user = req.user;
      const data = this.authService.signInWithGoogle(user['email']);
      return res.json({ ...data });
    } catch (error) {
      next(error);
    }
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
}

export default AuthController;
