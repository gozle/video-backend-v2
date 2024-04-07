import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { Language } from './language.model';

@Table
export class Translation extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.BIGINT)
  object_id: string;

  @Column(DataType.STRING)
  object_type: string;

  @Column({ type: DataType.TEXT })
  text: string;

  @BelongsTo(() => Language)
  language: Language;

  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER })
  languageId: number;
}
