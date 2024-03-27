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
  BelongsToMany,
} from 'sequelize-typescript';
import { Video } from './video.model';
import { User } from './user.model';
import {
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize';
import { Subscription } from './subscription.model';
import { ChannelPlaylist } from './playlistChannel.model';
import { Genre } from './genre.model';

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

  @HasMany(() => Subscription)
  subscription!: Subscription[];

  declare getSubscribes: HasManyGetAssociationsMixin<Subscription>;

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

  @ForeignKey(() => Genre)
  @Column
  genreId!: number;

  @BelongsTo(() => Genre)
  genre!: Channel;

  declare getGenre: BelongsToGetAssociationMixin<Genre>;

  isSubscribe: boolean;
}
