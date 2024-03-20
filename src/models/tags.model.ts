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
import { HasManyGetAssociationsMixin } from 'sequelize';
import { VideoTags } from './videoTags.model';

@Table
export class Tags extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Unique
  @Column(DataType.STRING)
  tag: string;

  // @HasMany(() => Video)
  // video!: Video;

  // declare getVideos: HasManyGetAssociationsMixin<Video>
  @BelongsToMany(() => Video, () => VideoTags)
  videos: Video[];
}
