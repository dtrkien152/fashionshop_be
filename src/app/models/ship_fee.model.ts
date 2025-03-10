import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IShipFee {
  id?: number;
  name?: string;
  triggerPrice?: number;
  fee?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'ship_fee', timestamps: true })
class ShipFee extends Model<IShipFee> {
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
    type: DataType.BIGINT,
    allowNull: true,
  })
  triggerPrice!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  fee!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;
}

export { IShipFee, ShipFee };
