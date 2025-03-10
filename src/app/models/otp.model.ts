import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

interface IOtp {
  id?: number;
  userId?: number;
  code?: string;
  action?: string;
  expired?: Date;
  isUsed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'otp', timestamps: true })
class Otp extends Model<IOtp> {
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
    type: DataType.STRING(6),
    allowNull: true,
  })
  code!: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  action!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expired!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isUsed!: boolean;
}

export { IOtp, Otp };
