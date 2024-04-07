import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';

import { Translation } from './translations.model';

@Table
export class Language extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  shortName: string;

  @HasMany(() => Translation)
  translation?: Translation;
}
