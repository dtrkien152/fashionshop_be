import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Tag } from './tag.model';
import { Blog } from './blog.model';

interface IBlogTag {
  id?: number;
  blogId?: number;
  tagId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'blog_tag', timestamps: true })
class BlogTag extends Model<IBlogTag> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Blog)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  blogId!: number;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  tagId!: number;
}

export { IBlogTag, BlogTag };
