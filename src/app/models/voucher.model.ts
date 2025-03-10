import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IVoucher {
  id?: number;
  code?: string;
  triggerPrice?: number;
  discountPercent?: number;
  maxDiscountPrice?: number;
  startAt?: Date;
  endAt?: Date;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'voucher', timestamps: true })
class Voucher extends Model<IVoucher> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  triggerPrice!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  discountPercent!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  maxDiscountPrice!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  createdBy!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  updatedBy!: string;
}

export { Voucher, IVoucher };
