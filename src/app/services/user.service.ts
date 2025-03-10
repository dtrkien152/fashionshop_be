import { injectable } from 'tsyringe';
import { IUser, User } from '../models';
import { ObjectUtils } from '../utils';
import { NotFoundError } from '../errors';

@injectable()
class UserService {
  constructor() {
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
    try {
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
    } catch (error) {
      console.error('Lỗi khi cập nhật user:', error);
      throw new Error('Không thể cập nhật thông tin user!');
    }
  }

  /**
   * Lấy thông tin cơ bản của user theo ID
   * @param {number} id - ID của user
   * @returns {Promise<object>} - Thông tin cơ bản của user hoặc null nếu không tìm thấy
   */
  async getById(id: number): Promise<object> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      throw new Error('Không thể lấy thông tin user.');
    }
  }
}

export default UserService;
