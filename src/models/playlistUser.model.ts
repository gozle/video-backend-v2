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
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Video } from './video.model';
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  DestroyOptions,
  NonAttribute,
} from 'sequelize';
import { UserPlaylistVideos } from './userPlaylistVideos.model';

@Table
export class UserPlaylist extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name: string;

  @BelongsToMany(() => Video, () => UserPlaylistVideos)
  video: Video[];

  declare addVideo: BelongsToManyAddAssociationMixin<Video, Video['id']>;
  declare getVideo: BelongsToManyGetAssociationsMixin<Video>;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  userId!: number;

  @Column(DataType.TEXT)
  description: string;
}
