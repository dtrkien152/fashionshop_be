import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ITag {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'tag', timestamps: true })
class Tag extends Model<ITag> {
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
}

export { Tag, ITag };
