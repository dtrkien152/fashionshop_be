import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Payment } from './payment.model';
import { Site } from './site.model';
import { OrderDetail } from './order_detail.model';
import { ProductSubDetailReview } from './product_sub_detail_review.model';

interface IOrder {
  id?: number;
  siteId?: number;
  code?: string;
  email?: string;
  voucherCode?: string;
  voucherDiscountPrice?: number;
  shippedAt?: Date;
  shipFee?: number;
  shipCode?: string;
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerDistrictId?: number;
  customerWardCode?: string;
  originTotalPrice?: number;
  paymentType?: string;
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
    type: DataType.BIGINT,
    allowNull: true,
  })
  voucherDiscountPrice!: number;

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
    type: DataType.STRING(32),
    allowNull: true,
  })
  shipCode!: string;

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
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerWardCode!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  customerDistrictId!: number;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  customerPhone!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  originTotalPrice!: number;

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

  @HasMany(() => OrderDetail)
  OrderDetails!: OrderDetail[];

  @HasMany(() => ProductSubDetailReview)
  productSubDetailReviews!: ProductSubDetailReview[];
}

export { IOrder, Order };
