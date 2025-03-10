import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IEvent {
  id?: number;
  name?: string;
  discountPercent?: number;
  startAt?: Date;
  endAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'event', timestamps: true })
class Event extends Model<IEvent> {
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
    type: DataType.DOUBLE,
    allowNull: true,
  })
  discountPercent!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endAt!: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  createdBy!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  updatedBy!: string;
}

export { IEvent, Event };
