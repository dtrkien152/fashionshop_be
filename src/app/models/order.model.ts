import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Payment } from './payment.model';
import { ShipInfo } from './ship_info.model';
import { Site } from './site.model';

interface IOrder {
  id?: number;
  siteId?: number;
  code?: string;
  email?: string;
  voucherCode?: string;
  shippedAt?: Date;
  shipFee?: number;
  shipName?: string;
  shipAddress?: string;
  shipMobile?: string;
  shipEmail?: string;
  totalPrice?: number;
  paymentId?: number;
  shipInfoId?: number;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'orders', timestamps: true })
class Order extends Model<IOrder> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Site)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  siteId!: number;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  voucherCode!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  shippedAt!: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  shipFee!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  shipName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  shipAddress!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  shipMobile!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  shipEmail!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice!: number;

  @ForeignKey(() => Payment)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentId!: number;

  @ForeignKey(() => ShipInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  shipInfoId!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  status!: string;

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

export { IOrder, Order };
