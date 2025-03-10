import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ProductSubDetail } from './product_sub_detail.model';
import { Cart } from './cart.model';

interface ICartDetail {
  cartId?: number;
  productSubDetailId?: number;
  unit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'cart_detail', timestamps: true })
class CartDetail extends Model<ICartDetail> {
  @PrimaryKey
  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cartId!: number;

  @PrimaryKey
  @ForeignKey(() => ProductSubDetail)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productSubDetailId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 1,
  })
  unit!: number;
}

export { ICartDetail, CartDetail };
