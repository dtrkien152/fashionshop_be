import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import { Category } from './category.model';
import {ProductSubDetail} from "./product_sub_detail.model";

interface IProduct {
  id?: number;
  categoryId?: number;
  code?: string;
  name?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  brand?: string;
  originalPrice?: number;
  salePrice?: number;
  description?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'product', timestamps: true })
class Product extends Model<IProduct> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  categoryId!: number;

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
  originalPrice!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  salePrice!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  thumbnailUrl!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  imageUrls!: string[];

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  brand!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

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

  @BelongsTo(() => Category)
  Category!: Category;

  @HasMany(() => ProductSubDetail)
  ProductSubDetails!: ProductSubDetail[];
}

export { IProduct, Product };
