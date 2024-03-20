import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Video } from './models/video.model';
import { Channel } from './models/channel.model';
import { Op, Sequelize, where } from 'sequelize';
import { User } from './models/user.model';
import sequelize from 'sequelize';
import { Like } from './models/like.model';

import { statSync, createReadStream } from 'fs';
import { Headers } from '@nestjs/common';
import { Response } from 'express';

import { Subscribe } from './models/subscribe.model';
import { UserHistory } from './models/userHistory.model';

@Injectable()
export class AppService {
  async getMain(): Promise<any> {
    const videos = await Video.findAll({
      limit: 25,
      offset: 0,
      where: { status: 'ok' },
      attributes: [
        'id',
        'title',
        'video_path',
        'views',
        'thumbnail',
        'channelId',
        'createdAt',
      ],
      include: {
        model: Channel,
        attributes: ['id', 'channel_name', 'avatar'],
      },
    });

    return { videos };
  }

  async getChannels(user: { id: number }): Promise<any> {
    const channels = await Channel.findAll({
      limit: 25,
      offset: 0,
      attributes: {
        include: [
          [
            Sequelize.literal(
              '( SELECT COUNT(*) FROM "Subscribes" WHERE "Subscribes"."channelId" =  "Channel"."id")',
            ),
            'subscribeCount',
          ],
          [
            Sequelize.literal(
              `(SELECT EXISTS (SELECT * FROM "Subscribes" WHERE "Subscribes"."channelId" = "Channel"."id" AND "Subscribes"."userId" = ${user.id}))`,
            ),
            'isSubsCribe',
          ],
        ],
        exclude: ['updatedAt', 'createdAt', 'description', 'profilePhoto'],
      },
    });
    return { channels };
  }

  async getChannel(id: number, req: any): Promise<any> {
    const page = req.query.page || 1;
    const user = req.user;
    const limitOfVideo = 15;

    const channel = await Channel.findByPk(id, {
      attributes: {
        exclude: ['updatedAt'],

        include: [
          [
            Sequelize.literal(
              '( SELECT COUNT(*) FROM "Subscribes" WHERE "Subscribes"."channelId" =  "Channel"."id")',
            ),
            'subscribeCount',
          ],
          [
            Sequelize.literal(
              `(SELECT EXISTS (SELECT * FROM "Subscribes" WHERE "Subscribes"."channelId" = "Channel"."id" AND "Subscribes"."userId" = ${user.id}))`,
            ),
            'isSubsCribe',
          ],
        ],
      },
      group: ['Channel.id'],
    });

    const videos = await channel.getVideos({
      limit: limitOfVideo,
      where: { status: 'ok' },
      offset: limitOfVideo * (page - 1),
      attributes: {
        exclude: ['updatedAt', 'description', 'channelId', 'video_path'],
      },
    });
    return { channel, videos };
  }

  async videoid(id: number, req: any) {
    const page = req.query.page || 1;
    const user = req.user;

    try {
      const video: Video = await Video.findByPk(id, {
        attributes: {
          exclude: ['updatedAt'],

          include: [
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."videoId" =  "Video"."id" AND "Likes"."reaction" = 'like')`,
              ),
              'likeCount',
            ],
            // [
            //   Sequelize.literal(
            //     `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."videoId" =  "Video"."id" AND "Likes"."reaction" = 'dislike')`,
            //   ),
            //   'disLikeCount',
            // ],
            [
              Sequelize.literal(
                `(SELECT "reaction" FROM "Likes" WHERE "Likes"."videoId" = "Video"."id" AND "Likes"."userId" =  ${user.id})`,
              ),
              'reaction',
            ],
          ],
        },
      });

      const channel = await video.getChannel({
        attributes: {
          exclude: ['profilePhoto', 'description', 'createdAt', 'updatedAt'],
          include: [
            [
              Sequelize.literal(
                '( SELECT COUNT(*) FROM "Subscribes" WHERE "Subscribes"."channelId" =  "Channel"."id")',
              ),
              'subscribeCount',
            ],
            [
              Sequelize.literal(
                `(SELECT EXISTS (SELECT * FROM "Subscribes" WHERE "Subscribes"."channelId" = "Channel"."id" AND "Subscribes"."userId" = ${user.id}))`,
              ),
              'isSubsCribe',
            ],
          ],
        },
      });

      const comments = await video.getComments({
        attributes: ['id', 'comment', 'createdAt'],
        // attributes: {
        // exclude: [],
        // include: [
        //   [
        //     Sequelize.literal(
        //       `( SELECT 'comment' FROM "Comments" WHERE "Comments"."videoId" =  "Video"."id")`,
        //     ),
        //     'commentChilds',
        //   ],
        // ],
        // },
        include: {
          model: User,
          attributes: ['id', 'username', 'avatar'],
        },
      });

      // const content = await Video.findAll({
      //   where: {
      //     id: {
      //       [Op.not]: id,
      //     },
      //     [Op.or]: {
      //       title: { [Op.iLike]: `%${video.title}%` },
      //       channelId: channel.id,
      //     },
      //   },
      //   limit: 10,
      //   offset: 0,
      //   attributes: ['id', 'title', 'thumbnail', 'views'],
      //   include: {
      //     model: Channel,
      //     attributes: ['id', 'channel_name', 'avatar'],
      //   },
      // });

      if (user.id > 0) {
        const history = await UserHistory.findOrCreate({
          where: { userId: user.id, videoId: video.id },
        });
        console.log(history);
      }
      return { video, channel, comments };
    } catch (err) {
      throw new Error(err);
    }
  }

  async fUserHistory(user: any) {
    const user1 = await User.findByPk(user.id);

    const history = await user1.getUserHistory({
      include: [
        {
          model: Video,
          required: false,
          attributes: {
            exclude: ['description', 'updatedAt', 'genreId'],
          },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar'],
            },
          ],
        },
      ],
      attributes: { exclude: ['userId', 'updatedAt', 'createdAt'] },
    });

    return history;
  }

  async fLikedVideos(user: any) {
    const user1 = await User.findByPk(user.id);
    const liked = await user1.getLikes({
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          attributes: {
            exclude: ['description', 'updatedAt', 'genreId'],
          },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar'],
            },
          ],
        },
      ],
    });
    return { liked };
  }

  async fUserLibrary(user: any) {
    const user1 = await User.findByPk(user.id);
    const history = await user1.getUserHistory({
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          attributes: {
            exclude: ['description', 'updatedAt', 'genreId'],
          },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar'],
            },
          ],
        },
      ],
      attributes: { exclude: ['userId', 'updatedAt', 'createdAt'] },
    });
    const liked = await user1.getLikes({
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          attributes: {
            exclude: ['description', 'updatedAt', 'genreId'],
          },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar'],
            },
          ],
        },
      ],
    });

    const playlist = await user1.getUserPlaylists({
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          attributes: {
            exclude: ['description', 'updatedAt', 'genreId'],
          },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar'],
            },
          ],
        },
      ],
    });
    return { history, playlist, liked };
  }
}
