import { Column, DataType, Model, Table, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Post } from './post.model';
import { PostCategory } from './post_category.model';

interface ITags {
  id?: number;
  name?: string;
  postId?:number;
  createdAt?: Date;
  updatedAt?: Date;
  count?: number; // Thêm count vào model
}

@Table({ tableName: 'tags', timestamps: true })  // Đổi tên bảng cho đúng
class Tags extends Model<ITags> {
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



  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId!: number;

  @BelongsTo(() => Post)
  post!: Post;

// Trường count sẽ tính toán số lần xuất hiện của name trong bảng tags
  @Column({
    type: DataType.VIRTUAL,
    get(this: Tags) {
      return this.getDataValue('count') || 0;
    },
  })
  count?: number;
}

export { ITags, Tags };
