import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Event } from './event.model';
import { Category } from './category.model';

interface ICategoryEvent {
  id?: number;
  categoryId?: number;
  eventId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'category_event', timestamps: true })
class CategoryEvent extends Model<ICategoryEvent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  categoryId!: number;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  eventId!: number;
}

export { ICategoryEvent, CategoryEvent };
