import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IPayment {
  id?: number;
  name?: string;
  thumbnailUrl?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'payment', timestamps: true })
class Payment extends Model<IPayment> {
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
  status!: boolean;
}

export { IPayment, Payment };
