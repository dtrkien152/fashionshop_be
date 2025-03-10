import { inject, injectable } from 'tsyringe';
import { UserService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { ObjectUtils } from '../utils';
import { UnauthorizedError } from '../errors';

@injectable()
class UserController {
  constructor(@inject(UserService) private userService: UserService) {
  }

  getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const session = req.session;
      if (!session || !session['userId']) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      const user = await this.userService.getById(session['userId']);
      const bodyResponse = ObjectUtils.convertAllowFields(user, ['id', 'email', 'full_name', 'gender', 'phone', 'avatar', 'is_active']);
      res.send({ data: bodyResponse });
    } catch (error) {
      next(error);
    }
  };

  updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.updateUserProfile(req.session['userId'], req.body);
      res.status(200).send('Moderator Content.');
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
