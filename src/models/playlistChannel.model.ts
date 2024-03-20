import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Video } from './video.model';
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  NonAttribute,
} from 'sequelize';
import { ChannelPlaylistVideos } from './channelPlaylistVideos';
import { Channel } from './channel.model';

@Table
export class ChannelPlaylist extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  name: string;

  @BelongsToMany(() => Video, () => ChannelPlaylistVideos)
  video: Video[];

  declare addVideo: BelongsToManyAddAssociationMixin<Video, Video['id']>;
  declare getVideo: BelongsToManyGetAssociationsMixin<Video>;

  @BelongsTo(() => Channel)
  declare channel?: NonAttribute<Channel>;

  @ForeignKey(() => Channel)
  @Column(DataType.BIGINT)
  channelId!: number;

  @Column(DataType.TEXT)
  description: string;
}
