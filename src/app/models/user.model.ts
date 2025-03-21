import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Post } from './post.model';
import { Comment } from './comment.model';

interface IUser {
  id?: number;
  code?: string;
  email?: string;
  password?: string;
  fullName?: string;
  gender?: boolean;
  phone?: string;
  avatar?: string;
  role?: string;
  googleId?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'user', timestamps: true })
class User extends Model<IUser> {
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
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fullName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  gender!: boolean;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING(32),
    allowNull: true,
  })
  role!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  googleId!: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  avatar!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isActive!: boolean;

@HasMany(() => Comment)
comments!: Comment[];
}



export { User, IUser };
