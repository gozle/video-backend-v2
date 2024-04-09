import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Video } from './video.model';
import { User } from './user.model';

@Table
export class Comment extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id!: number;

  @Column(DataType.STRING)
  text: string;

  @BelongsTo(() => Video)
  video!: Video;

  @ForeignKey(() => Video)
  @Column(DataType.BIGINT)
  videoId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @Column(DataType.BIGINT)
  parent: number;
}
