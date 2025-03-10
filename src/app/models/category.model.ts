import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ICategory {
  id?: number;
  code?: string;
  name?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'category', timestamps: true })
class Category extends Model<ICategory> {
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
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;
}

export { ICategory, Category };
