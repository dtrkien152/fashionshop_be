import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

interface IUserAddress {
  id?: number;
  userId?: number;
  city?: string;
  addressName?: string;
  receiverName?: string;
  receiverPhone?: string;
  fullAddress?: string;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user_address', timestamps: true })
class UserAddress extends Model<IUserAddress> {
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

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  receiverName!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  receiverPhone!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  addressName!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fullAddress!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isDefault!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isActive!: boolean;
}

export { UserAddress, IUserAddress };
