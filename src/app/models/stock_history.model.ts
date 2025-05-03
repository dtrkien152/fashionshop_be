import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Site } from './site.model';
import { ProductSubDetail } from './product_sub_detail.model';

interface IStockHistory {
  id?: number;
  siteId?: number;
  productSubDetailId?: number;
  unit?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
}

@Table({ tableName: 'stock_history', timestamps: true })
class StockHistory extends Model<IStockHistory> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Site)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  siteId!: number;

  @ForeignKey(() => ProductSubDetail)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productSubDetailId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  unit!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  createdBy!: string;

  @BelongsTo(() => Site)
  site!: Site;

  @BelongsTo(() => ProductSubDetail)
  productSubDetail!: ProductSubDetail;

}

export { StockHistory, IStockHistory };
