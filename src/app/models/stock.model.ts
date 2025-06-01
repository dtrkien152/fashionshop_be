import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Site } from './site.model';
import { ProductSubDetail } from './product_sub_detail.model';

interface IStock {
  siteId?: number;
  productSubDetailId?: number;
  unit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'stock', timestamps: true })
class Stock extends Model<IStock> {
  @PrimaryKey
  @ForeignKey(() => Site)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  siteId!: number;

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
    defaultValue: 0,
  })
  unit!: number;

  @BelongsTo(() => Site)
  site!: Site;

  @BelongsTo(() => ProductSubDetail)
  productSubDetail!: ProductSubDetail;

}

export { Stock, IStock };
