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
    HasMany

} from 'sequelize-typescript';
import { User } from './user.model';
import { HasManyAddAssociationMixin, HasManyGetAssociationsMixinOptions, NonAttribute } from 'sequelize';
import { Video } from './video.model';
import { HasManyGetAssociationsMixin } from 'sequelize';
import { Tags } from './tags.model';




@Table
export class VideoTags extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id!: number;

    @ForeignKey(() => Video)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    videoId: number;

    @ForeignKey(() => Tags)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    tagId: number;
}