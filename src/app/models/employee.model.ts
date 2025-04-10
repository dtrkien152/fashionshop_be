import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Site } from './site.model';

interface IEmployee {
  id?: number;
  siteId?: number;
  code?: string;
  username?: string;
  password?: string;
  fullName?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user', timestamps: true })
class Employee extends Model<IEmployee> {
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

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  role!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;

  @BelongsTo(() => Site)
  site!: Site;
}


export { Employee, IEmployee };
