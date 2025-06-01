import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Order } from './order.model';
import { ProductSubDetail } from './product_sub_detail.model';

interface IOrderDetail {
  id?: number;
  orderId?: number;
  productSubDetailId?: number;
  unit?: number;
  totalPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'order_detail', timestamps: true })
class OrderDetail extends Model<IOrderDetail> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId!: number;

  @ForeignKey(() => ProductSubDetail)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productSubDetailId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  unit!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => ProductSubDetail)
  productSubDetail!: ProductSubDetail;
}

export { IOrderDetail, OrderDetail };
