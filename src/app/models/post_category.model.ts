import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Post } from './post.model';

interface IPostCategory {
  id?: number;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'post_category', timestamps: true })  // Đổi tên bảng cho đúng
class PostCategory extends Model<IPostCategory> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Post)  // Quan hệ 1-n với Post
  posts!: Post[];
}

export { IPostCategory, PostCategory };
