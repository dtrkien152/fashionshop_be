import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

interface ICart {
  id?: number;
  userId?: number;
  fingerprint?: string;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'cart', timestamps: true })
class Cart extends Model<ICart> {
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
    type: DataType.STRING(50),
    allowNull: true,
  })
  fingerprint!: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    unique: true,
  })
  code!: string;
}

export { ICart, Cart };
