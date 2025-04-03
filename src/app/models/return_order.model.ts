import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Order } from './order.model';

interface IReturnOrder {
  orderId?: number;
  reason?: string;
  totalPrice?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'return_order', timestamps: true })
class ReturnOrder extends Model<IReturnOrder> {
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
    primaryKey: true,
  })
  orderId!: number;

  @Column({
    type: DataType.STRING(512),
    allowNull: true,
  })
  reason!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice!: number;

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

export { IReturnOrder, ReturnOrder };
