import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Post } from './post.model';

interface IComment {
  id?: number;
  userId?: number;
  postId?: number;
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
    allowNull: false,  // Không nên cho phép `null` nếu comment bắt buộc có user
  })
  userId!: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,  // Không nên cho phép `null` nếu comment bắt buộc có bài viết
  })
  postId!: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,  // Comment không nên `null`
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @BelongsTo(() => User)  // Định nghĩa quan hệ với User
  user!: User;

  @BelongsTo(() => Post)  // Định nghĩa quan hệ với Post
  post!: Post;
}

export { IComment, Comment };
