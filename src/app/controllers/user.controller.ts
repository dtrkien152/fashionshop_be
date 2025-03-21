import { inject, injectable } from 'tsyringe';
import { UserService } from '../services';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ObjectUtils } from '../utils';
import { UnauthorizedError } from '../errors';
import { IUserAddress } from '../models';

@injectable()
class UserController {

  constructor(@inject(UserService) private userService: UserService) {
  }

  getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const session = req.session;
      const { userId } = req.session;
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

  updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const session = req.session;
      const { userId } = req.session;
      await this.userService.updateUserProfile(userId, req.body);
      res.status(200).send('Moderator Content.');
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const session = req.session;
      const { userId } = req.session;
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
  getAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.session;
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      const addresses = await this.userService.getAddressesByUserId(userId);
      res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  };

  createAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { userId } = req.session;
      if (!userId) {
        throw new UnauthorizedError('Phiên đăng nhập hết hạn');
      }
      const model = { ...req.body, userId: userId };
      const address = await this.userService.createAddress(model);
      res.status(201).json(address);
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

      const { userId } = req.session;

      // Kiểm tra xem userId có tồn tại hay không
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not found in session' });
      }

      const addressData: Partial<IUserAddress> = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!addressData.fullAddress || !addressData.addressName) {
        return res.status(400).json({ message: 'Thiếu thông tin địa chỉ hoặc thành phố' });
      }

      const [affectedCount, updatedAddresses] = await this.userService.updateAddress(addressData.id, addressData);

      if (affectedCount === 0) {
        return res.status(404).json({ message: 'Địa chỉ không tồn tại!' });
      }

      res.status(200).json(updatedAddresses[0]);
    } catch (error) {
      next(error);
    }
  };

  updateDefaultAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const { userId } = req.session;
      await this.userService.setDefaultAddress(userId, Number(id));
      res.status(200).json({ message: 'Đã cập nhật địa chỉ mặc định!' });
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      await this.userService.deleteAddress(Number(id));
      res.status(200).json({ message: 'Đã xóa địa chỉ thành công!' });
    } catch (error) {
      next(error);
    }
  };

  uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const { userId } = req.session;
      const result = await this.userService.uploadAvatar(userId, req.file.buffer, req.file.mimetype);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}


export default UserController;
