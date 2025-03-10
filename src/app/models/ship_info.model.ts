import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IShipInfo {
  id?: number;
  shipperName?: string;
  shipperPhone?: string;
  note?: string;
  status?: boolean;
  shipReferenceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'ship_info', timestamps: true })
class ShipInfo extends Model<IShipInfo> {
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
  shipperName!: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  shipperPhone!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  note!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  status!: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  shipReferenceId!: string;
}

export { ShipInfo, IShipInfo };
