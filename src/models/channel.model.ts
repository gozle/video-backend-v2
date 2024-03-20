import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  BelongsTo,
  ForeignKey,
  Unique,
  DataType,
} from 'sequelize-typescript';
import { Video } from './video.model';
import { User } from './user.model';
import {
  BelongsToGetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize';
import { Subscribe } from './subscribe.model';
import { ChannelPlaylist } from './playlistChannel.model';

@Table
export class Channel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  channel_name: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  profilePhoto: string;

  @Column(DataType.STRING)
  avatar: string;

  @HasMany(() => Video)
  videos!: Video[];

  @HasMany(() => Subscribe)
  subscribe!: Subscribe[];

  @HasMany(() => ChannelPlaylist)
  channelPlaylists!: ChannelPlaylist;

  declare getChannelPlaylists: HasManyGetAssociationsMixin<ChannelPlaylist>;
  declare addChannelPlaylists: HasManyAddAssociationsMixin<
    ChannelPlaylist,
    ChannelPlaylist['id']
  >;

  declare setChannelPlaylists: HasManySetAssociationsMixin<
    ChannelPlaylist,
    ChannelPlaylist['id']
  >;

  declare addVideo: HasManyAddAssociationMixin<Video, Video['id']>;
  declare getVideos: HasManyGetAssociationsMixin<Video>;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  declare getUser: BelongsToGetAssociationMixin<User>;

  isSubscribe: boolean;
}
