import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

interface INotify {
  id?: number;
  type?: string;
  title?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'notify', timestamps: true })
class Notify extends Model<INotify> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  type!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  title!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  content!: string;
}

export { INotify, Notify };
