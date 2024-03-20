import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsToMany, BelongsTo, Unique, DataType } from 'sequelize-typescript';

import { Channel } from './channel.model';
import { User } from './user.model';




@Table
export class Subscribe extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id!: number;

    @BelongsTo(() => Channel)
    channel!: Channel

    @ForeignKey(() => Channel)
    @Column
    channelId!: number;

    @BelongsTo(() => User)
    user!: User

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;



}