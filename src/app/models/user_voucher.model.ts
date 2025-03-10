import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Voucher } from './voucher.model';

interface IUserVoucher {
  id?: number;
  userId?: number;
  voucherId?: number;
  isUsed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user_voucher', timestamps: true })
class UserVoucher extends Model<IUserVoucher> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId!: number;

  @ForeignKey(() => Voucher)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  voucherId!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isUsed!: boolean;
}

export { UserVoucher, IUserVoucher };
