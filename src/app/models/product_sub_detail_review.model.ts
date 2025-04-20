import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Order } from './order.model';
import { ProductSubDetail } from './product_sub_detail.model';

interface IProductSubDetailReview {
  id?: number;
  orderId?: number;
  productSubDetailId?: number;
  comment?: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'product_sub_detail_review', timestamps: true, underscored: true })
class ProductSubDetailReview extends Model<IProductSubDetailReview> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId!: number;

  @ForeignKey(() => ProductSubDetail)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productSubDetailId!: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  comment!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @BelongsTo(() => ProductSubDetail)
  productSubDetail!: ProductSubDetail;
}

export { ProductSubDetailReview, IProductSubDetailReview };
