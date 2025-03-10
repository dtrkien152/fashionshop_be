import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Blog } from './blog.model';

interface IComment {
  id?: number;
  userId?: number;
  blogId?: number;
  content?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'comment', timestamps: true })
class Comment extends Model<IComment> {
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

  @ForeignKey(() => Blog)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  blogId!: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isActive!: boolean;
}

export { IComment, Comment };
