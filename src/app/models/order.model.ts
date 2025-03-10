import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Payment } from './payment.model';
import { Site } from './site.model';

interface IOrder {
  id?: number;
  siteId?: number;
  code?: string;
  email?: string;
  voucherCode?: string;
  shippedAt?: Date;
  shipFee?: number;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  totalPrice?: number;
  paymentType?: number;
  paymentStatus?: string;
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
  customerName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerAddress!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  customerPhone!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice!: number;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  paymentType!: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  paymentStatus!: string;

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
