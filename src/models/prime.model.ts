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
    Unique

} from 'sequelize-typescript';
import { User } from './user.model';
import { BelongsToGetAssociationMixin, NonAttribute } from 'sequelize';




@Table
export class Prime extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id!: number;

    @Column(DataType.STRING)
    prime: string;

    @Column(DataType.ENUM('1m', '3m', 'test'))
    type: string;

    @Column(DataType.DATE)
    expire: string;

    declare user?: NonAttribute<User>;
    declare getUser: BelongsToGetAssociationMixin<User>;

    @ForeignKey(() => User)
    @Unique
    @Column(DataType.INTEGER)
    userId!: number;

}