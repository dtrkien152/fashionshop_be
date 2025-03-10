import { inject, injectable } from 'tsyringe';
import { UserService } from '../services';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ObjectUtils } from '../utils';
import { NotFoundError, UnauthorizedError } from '../errors';

@injectable()
class UserController {
  constructor(@inject(UserService) private userService: UserService) {
  }

  getMyProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.session['userId'];
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      const user = await this.userService.getById(userId);
      const bodyResponse = ObjectUtils.convertAllowFields(user.toJSON(), [
        'id', 'email', 'fullName', 'gender', 'phone', 'avatar', 'isActive',
      ]);
      res.send({ data: bodyResponse });
    } catch (error) {
      next(error);
    }
  };

  updateMyProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.session['userId'];
      await this.userService.updateUserProfile(userId, req.body);
      res.status(200).send('Moderator Content.');
    } catch (error) {
      next(error);
    }
  };

  getUserProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.session['userId'];
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }

      const user = await this.userService.getById(userId);
      if (user) {
        const data = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatar: user.avatar,
        };
        res.json({ data });
        return;
      }
      res.json(null);
    } catch (error) {
      next(error);
    }
  };

  // 🟢 Hàm mới: Lấy thông tin tất cả địa chỉ của người dùng
  getAddress: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.session['userId'];
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      const addresses = await this.userService.getAddressesByUserId(userId);
      res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  };

  createAddress: RequestHandler = async (req, res, next) => {
    try {
      const address = await this.userService.createAddress(req.body);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  };

  updateAddress: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const [affectedCount, updatedAddresses] = await this.userService.updateAddress(Number(id), req.body);
      if (affectedCount === 0) {
        throw new NotFoundError('Địa chỉ không tồn tại!');
      }
      res.json(updatedAddresses[0]);
    } catch (error) {
      next(error);
    }
  };

  updateDefaultAddress: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      await this.userService.setDefaultAddress(userId, Number(id));
      res.status(200).json({ message: 'Đã cập nhật địa chỉ mặc định!' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
