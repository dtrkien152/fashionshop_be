import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

interface INotify {
  id?: number;
  userId?: number;
  content?: string;
  isRead?: boolean;
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isRead!: boolean;
}

export { INotify, Notify };
