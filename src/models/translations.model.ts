import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { Video } from './video.model';
import { User } from './user.model';
import { NonAttribute } from 'sequelize';
import { Language } from './language.model';

@Table
export class Translation extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  object_type: string;

  @Column(DataType.STRING)
  object_id: string;

  @Column({ type: DataType.TEXT })
  text: string;

  @BelongsTo(() => Language)
  language: Language;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER })
  languageId: number;
}
