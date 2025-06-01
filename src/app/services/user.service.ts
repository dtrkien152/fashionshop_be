import { inject, injectable } from 'tsyringe';
import { Employee, IUser, IUserAddress, User, UserAddress } from '../models';
import { ObjectUtils } from '../utils';
import { NotFoundError } from '../errors';
import FileService from './file.service';
import bcrypt from 'bcryptjs';

@injectable()
class UserService {
  constructor(@inject(FileService) private fileService: FileService) {
  }

  getByEmail = async (email: string) => {
    return await User.findOne({ where: { email } });
  };

  isExistsEmail = async (email: string) => {
    const user = await this.getByEmail(email);
    return !!user;
  };

  /**
   * Cập nhật thông tin cá nhân của user (trừ địa chỉ)
   * @param {number} id - ID của user cần cập nhật
   * @param {object} updatedData - Dữ liệu mới để cập nhật (email, full_name, gender, phone, avatar)
   * @returns {Promise<object>} - Thông tin user đã được cập nhật
   */
  async updateUserProfile(id: number, updatedData: IUser): Promise<object> {
    // Chỉ cho phép cập nhật các trường sau
    const filteredData = ObjectUtils.convertAllowFields(updatedData, ['full_name', 'gender', 'phone']);
    // Tìm user theo ID
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }
    // Cập nhật thông tin user
    await user.update(filteredData);
    return user;
  }

  /**
   * Lấy thông tin cơ bản của user theo ID
   * @param {number} id - ID của user
   * @returns {Promise<User>} - Thông tin cơ bản của user hoặc null nếu không tìm thấy
   */
  async getById(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }
    return user;
  }

  async createAddress(data: IUserAddress): Promise<UserAddress> {
    if (data.isDefault) {
      await UserAddress.update({ isDefault: false }, { where: { userId: data.userId } });
    }
    return UserAddress.create(data);
  }

  async updateAddress(id: number, data: Partial<IUserAddress>): Promise<[number, UserAddress[]]> {
    return UserAddress.update(data, { where: { id }, returning: true });
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    await UserAddress.update({ isDefault: false }, { where: { userId } });
    await UserAddress.update({ isDefault: true }, { where: { id: addressId } });
  }

  /**
   * Lấy danh sách địa chỉ của người dùng theo ID người dùng
   * @param {number} userId - ID của người dùng
   * @returns {Promise<UserAddress[]>} - Danh sách địa chỉ của người dùng
   */
  async getAddressesByUserId(userId: number): Promise<UserAddress[]> {
    return await UserAddress.findAll({
      where: { userId },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']], // Địa chỉ mặc định trước, sau đó theo thời gian tạo mới nhất
    });
  }

  async deleteAddress(addressId: number): Promise<void> {
    const address = await UserAddress.findByPk(addressId);

    if (!address) {
      throw new Error('Địa chỉ không tồn tại!');
    }

    const isDefault = address.isDefault;
    const userId = address.userId;

    // Xoá địa chỉ
    await address.destroy();

    // Nếu địa chỉ bị xoá là mặc định, tìm địa chỉ gần nhất để set mặc định mới
    if (isDefault) {
      const nextDefault = await UserAddress.findOne({
        where: { userId, isActive: true },
        order: [['createdAt', 'DESC']],
      });

      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }
  }


  /**
   * Upload avatar cho user và cập nhật vào database
   * @param {number} userId - ID của user
   * @param {Buffer} fileBuffer - Dữ liệu file avatar dưới dạng Buffer
   * @param {string} mimeType - Kiểu file (MIME type)
   * @returns {Promise<string>} - URL của avatar mới
   */
  async uploadAvatar(userId: number, fileBuffer: Buffer, mimeType: string): Promise<string> {
    // Kiểm tra xem user có tồn tại không
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }

    // Upload avatar lên Azure
    const fileName = `avatar-${userId}-${Date.now()}.jpg`; // Tên file theo ID user
    const avatar = await this.fileService.uploadFileToAzure(fileBuffer, mimeType, fileName);

    // Cập nhật URL avatar vào database
    await user.update({ avatar });

    return avatar; // Trả về URL avatar mới
  }

  async changePassword(userId: number, oldPassword: any, newPassword: any) {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
      throw new NotFoundError('Bạn đã nhập sai password');
    }
    await user.update({ password: bcrypt.hashSync(newPassword, 8) });
    return { success: true };
  }
  async changeEmployeePassword(userId: number, oldPassword: any, newPassword: any) {
    const user = await Employee.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User không tồn tại!');
    }

    // 🔑 Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
      throw new NotFoundError('Bạn đã nhập sai password');
    }
    await user.update({ password: bcrypt.hashSync(newPassword, 8) });
    return { success: true };
  }

}


export default UserService;
