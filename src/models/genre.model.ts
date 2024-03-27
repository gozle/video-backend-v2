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
  HasMany,
} from 'sequelize-typescript';

import { Video } from './video.model';
import { User } from './user.model';
import { NonAttribute } from 'sequelize';
import { Channel } from './channel.model';

@Table
export class Genre extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  genre: string;

  @HasMany(() => Video)
  videos!: Video[];

  @HasMany(() => Channel)
  channel!: Channel[];
}
