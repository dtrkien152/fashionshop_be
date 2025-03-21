import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Post } from './post.model';

@Table({ tableName: 'comment', timestamps: true })
class Comment extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId!: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @BelongsTo(() => User) // Fix lỗi quan hệ với User
  user!: User;

  @BelongsTo(() => Post) // Quan hệ với Post
  post!: Post;
}

export { Comment };
