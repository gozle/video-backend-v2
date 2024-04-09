import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Video } from './video.model';
import { NonAttribute } from 'sequelize';

@Table
export class UserHistory extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => Video)
  @Column
  videoId!: number;

  @BelongsTo(() => Video)
  declare video?: NonAttribute<Video>;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @Column(DataType.BIGINT)
  wathTime: number;
}
