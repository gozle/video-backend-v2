import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';

import { Video } from './video.model';

import { ChannelPlaylist } from './playlistChannel.model';

@Table
export class ChannelPlaylistVideos extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @ForeignKey(() => ChannelPlaylist)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  channelPlaylistId: number;

  @ForeignKey(() => Video)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  videoId: number;
}
