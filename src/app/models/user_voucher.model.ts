import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Voucher } from './voucher.model';

interface IUserVoucher {
  userId?: number;
  voucherId?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user_voucher', timestamps: true })
class UserVoucher extends Model<IUserVoucher> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId!: number;

  @PrimaryKey
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
  isActive!: boolean;
}

export { UserVoucher, IUserVoucher };
