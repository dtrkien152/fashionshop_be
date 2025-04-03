import { Column, DataType, ForeignKey, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { PostCategory } from './post_category.model';
import { Comment } from './comment.model';
import { Tags } from './tags.model';

interface IPost {
  id?: number;
  code?: string;
  title?: string;
  author?: string;
  content?: string;
  thumbnailUrl?: string;
  postCategoryId?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'post', timestamps: true })  // Đổi tên bảng cho đúng
class Post extends Model<IPost> {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  content!: string;

  @Column({
    type: DataType.STRING(255),  // Tăng độ dài URL
    allowNull: true,
  })
  thumbnailUrl!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;

  @ForeignKey(() => PostCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  postCategoryId!: number;

  @BelongsTo(() => PostCategory)  // Định nghĩa quan hệ với PostCategory
  category!: PostCategory;

  @HasMany(() => Comment)  // Định nghĩa quan hệ với PostCategory
  comments!: Comment[];

  @HasMany(() => Tags)
  tags!: Tags[];
}

export { IPost, Post };
