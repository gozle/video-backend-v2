import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';

import { Video } from './video.model';
import { Channel } from './channel.model';

@Table
export class Genre extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  name: string;

  @HasMany(() => Video)
  videos!: Video[];

  @HasMany(() => Channel)
  channel!: Channel[];
}
