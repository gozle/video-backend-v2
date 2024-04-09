import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  HasMany,
  DataType,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
// import { Channel } from './channel.model';
import { UserHistory } from './userHistory.model';

import { ApiProperty } from '@nestjs/swagger';
import { NonAttribute } from '@sequelize/core';
import {
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from 'sequelize';
import { IsByteLength, IsEmail, IsString, Validate } from 'class-validator';
import { MatchPassword } from '../validation/match_pass.validator';
import { IsPhone } from '../validation/tel_number.validator';
import { EmailInDb } from '../validation/email.validator';
import { Prime } from './prime.model';
import { Like } from './like.model';

import { Subscription } from './subscription.model';
import { Video } from './video.model';
import { Comment } from './comment.model';
import { UserPlaylist } from './playlistUser.model';
import { Channel } from './channel.model';

@Table
export class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.BIGINT, allowNull: false })
  id!: number;

  // @IsString()
  // @IsAlphanumeric()
  // @IsByteLength(3, 25, { message: 'Name must be between 3 and 25 characters!' })
  // @ApiProperty()
  // @Column(DataType.STRING)
  // fullName: string;

  @Unique
  @IsString()
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @IsEmail()
  @ApiProperty()
  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty()
  @IsByteLength(8, 64, {
    message: 'Password must be between 8 and 64 characters!',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isVerify: boolean;

  @Validate(MatchPassword, ['password'])
  conPassword: string;

  // @IsNumber()
  // @IsByteLength(8, 8, { message: 'Please enter valid number!' })
  // @Validate(IsPhone)
  tel: number;

  @ApiProperty()
  @Column(DataType.BIGINT)
  tel_number: number;

  @Column(DataType.STRING)
  avatar: string;

  // @Column(DataType.STRING)
  // premium: string;

  @HasMany(() => Channel)
  channel?: NonAttribute<Channel>;

  declare getChannel: HasManyGetAssociationsMixin<Channel>;
  // declare setChannel: HasOneSetAssociationMixin<
  //     Channel,
  //     Channel['id']
  // >;

  @HasOne(() => Prime, 'userId')
  prime?: NonAttribute<Prime>;

  declare getPrime: HasOneGetAssociationMixin<Prime>;
  declare setPrime: HasOneSetAssociationMixin<Prime, Prime['id']>;

  @HasMany(() => UserHistory)
  userHistory!: UserHistory;

  declare getUserHistory: HasManyGetAssociationsMixin<UserHistory>;

  // @BelongsToMany(() => Video, { through: "Like", targetKey: 'videoId', foreignKey: 'userId' })
  // likes: Video[];

  @HasMany(() => Like)
  likes!: Like;

  declare getLikes: HasManyGetAssociationsMixin<Like>;
  declare setLikes: HasManySetAssociationsMixin<Like, Like['id']>;

  @HasMany(() => Comment)
  comments!: Comment;

  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare setComments: HasManySetAssociationsMixin<Comment, Comment['id']>;

  @HasMany(() => Subscription)
  subscription!: Subscription[];

  declare getSubscription: BelongsToManyGetAssociationsMixin<Channel>;

  @HasMany(() => UserPlaylist)
  userPlaylists!: UserPlaylist;

  declare getUserPlaylists: HasManyGetAssociationsMixin<UserPlaylist>;

  declare setUserPlaylist: HasManySetAssociationsMixin<
    UserPlaylist,
    UserPlaylist['id']
  >;
}
