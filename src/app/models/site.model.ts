import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Stock } from './stock.model';

interface ISite {
  id?: number;
  code?: string;
  name?: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'site', timestamps: true })
class Site extends Model<ISite> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

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
  name!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  address!: string;

  @HasMany(() => Stock)
  stocks!: Stock[];

}


export { Site, ISite };
