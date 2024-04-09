import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  Unique,
  DataType,
} from 'sequelize-typescript';

import { Video } from './video.model';
import { User } from './user.model';
import { NonAttribute } from 'sequelize';

@Table
export class Like extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @BelongsTo(() => Video)
  video!: Video;

  @ForeignKey(() => Video)
  @Column
  videoId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @Column(DataType.STRING)
  reaction: string;
}
