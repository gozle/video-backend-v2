import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  DataType,
  Unique,
} from 'sequelize-typescript';
// import { Channel } from './channel.model'
import { Comment } from './comment.model';
import { Like } from './like.model';

import {
  BelongsToGetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize';

import { Channel } from './channel.model';
import { HasManyGetAssociationsMixinOptions } from 'sequelize';
import { Genre } from './genre.model';
import { UserHistory } from './userHistory.model';
import { UserPlaylist } from './playlistUser.model';
import { UserPlaylistVideos } from './userPlaylistVideos.model';
import { ChannelPlaylist } from './playlistChannel.model';
import { ChannelPlaylistVideos } from './channelPlaylistVideos';

@Table
export class Video extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  id!: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING)
  video_path: string;

  @Column(DataType.BIGINT)
  views: number;

  @Column(DataType.STRING)
  thumbnail: string;

  @Column(DataType.FLOAT)
  duration: number;

  @Column(DataType.STRING)
  status: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  publicId: string;

  @ForeignKey(() => Channel)
  @Column({ type: DataType.BIGINT, allowNull: false })
  channelId!: number;

  @BelongsTo(() => Channel)
  channel!: Channel;

  declare getChannel: BelongsToGetAssociationMixin<Channel>;

  @ForeignKey(() => Genre)
  @Column
  genreId!: number;

  @BelongsTo(() => Genre)
  genre!: Channel;

  declare getGenre: BelongsToGetAssociationMixin<Genre>;

  @HasMany(() => Comment)
  comment!: Comment;

  declare getComment: HasManyGetAssociationsMixin<Comment>;
  declare addComment: HasManyAddAssociationMixin<Comment, Comment['id']>;

  @HasMany(() => Like)
  like!: Like;

  declare getLike: HasManyGetAssociationsMixin<Like>;

  // @BelongsToMany(() => Tags, () => VideoTags)
  // tags: Tags[];

  @BelongsToMany(() => UserPlaylist, () => UserPlaylistVideos)
  userPlaylist: UserPlaylist[];

  declare UserPlaylistVideos: NonAttribute<UserPlaylistVideos>;

  @BelongsToMany(() => ChannelPlaylist, () => ChannelPlaylistVideos)
  channelPlaylist: ChannelPlaylist[];
}
