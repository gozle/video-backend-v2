import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Video } from './video.model';
import { NonAttribute } from 'sequelize';
import { User } from './user.model';

@Table
export class Comment extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  comment: string;

  @ForeignKey(() => Video)
  @Column(DataType.INTEGER)
  videoId!: number;

  @BelongsTo(() => Video)
  video!: Video;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.INTEGER)
  child: number;
  //declare video?: NonAttribute<Video>;

  // declare user?: NonAttribute<User>;
}
