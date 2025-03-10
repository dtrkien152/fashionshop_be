import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ISite {
  id?: number;
  code?: string;
  name?: string;
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
    type: DataType.STRING(50),
    allowNull: true,
  })
  address!: string;
}

export { Site, ISite };
