import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import { Site } from './site.model';
import { ProductSubDetail } from './product_sub_detail.model';

interface IStock {
  id?: number;
  siteId?: number;
  productSubDetailId?: number;
  unit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'stock', timestamps: true })
class Stock extends Model<IStock> {
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

  @ForeignKey(() => ProductSubDetail)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productSubDetailId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  unit!: number;

  @BelongsTo(() => Site)
  site!: Site;

  @BelongsTo(() => ProductSubDetail)
  productSubDetail!: ProductSubDetail;

}

export { Stock, IStock };
