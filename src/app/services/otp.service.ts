import { injectable } from 'tsyringe';
import { GenerateUtils } from '../utils';
import { Otp } from '../models';
import moment from 'moment';
import { Op } from 'sequelize';

@injectable()
class OtpService {
  constructor() {
  }

  create = async (userId: number, action: string) => {
    const otp = GenerateUtils.otp();
    return await Otp.create({
      userId,
      action,
      code: otp,
      expired: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes,
      isUsed: false,
    });
  };

  verify = async (userId: number, code: string, action: string) => {
    const otp = await Otp.findOne({
      where: {
        userId,
        code,
        action,
        isUsed: false,
        expired: {
          [Op.gt]: moment().utc().toDate(),
        },
      },
    });

    if (!otp) {
      return false;
    }

    otp.isUsed = true;
    await otp.save();

    return true;
  };
}

export default OtpService;
