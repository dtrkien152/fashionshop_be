import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IBlog {
  id?: number;
  code?: string;
  title?: string;
  author?: string;
  content?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'blog', timestamps: true })
class Blog extends Model<IBlog> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: true,
  })
  title!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  author!: string;

  @Column({
    type: DataType.STRING(5000),
    allowNull: true,
  })
  content!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  thumbnailUrl!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;
}

export { IBlog, Blog };
