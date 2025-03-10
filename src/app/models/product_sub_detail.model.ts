import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import { Product } from './product.model';
import {Category} from "./category.model";
import {Stock} from "./stock.model";

interface IProductSubDetail {
  id?: number;
  productId?: number;
  size?: string;
  color?: string;
  isActive?: boolean;
  updatedBy?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'product_sub_detail', timestamps: true })
class ProductSubDetail extends Model<IProductSubDetail> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productId!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  size!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  color!: string;


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
  updatedBy!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  createdBy!: string;

  @BelongsTo(() => Product)
  Product!: Product;

  @HasMany(() => Stock)
  Stocks!: Stock[];
}

export { IProductSubDetail, ProductSubDetail };
