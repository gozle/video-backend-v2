import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  DataType,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import {
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixinOptions,
  NonAttribute,
} from 'sequelize';
import { Video } from './video.model';

import { UserPlaylist } from './playlistUser.model';

@Table
export class UserPlaylistVideos extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => UserPlaylist)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userPlaylistId: number;

  @ForeignKey(() => Video)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  videoId: number;
}
