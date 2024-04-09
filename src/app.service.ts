import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Video } from './models/video.model';
import { Channel } from './models/channel.model';
import { Sequelize } from 'sequelize';
import { User } from './models/user.model';

import { UserHistory } from './models/userHistory.model';
import { Subscription } from './models/subscription.model';
import { Genre } from './models/genre.model';
import { Language } from './models/language.model';
import { Translation } from './models/translations.model';
import { Comment } from './models/comment.model';

@Injectable()
export class AppService {
  async getSideBar(userPayload, lang): Promise<any> {
    const user = await User.findByPk(userPayload.id);

    let subscription = [];
    if (user) {
      subscription = await user.getSubscription({
        attributes: [
          'channelId',
          [
            Sequelize.literal(
              '( SELECT channel_name FROM "Channels" WHERE "Channels"."id" =  "Subscription"."channelId")',
            ),
            'channel_name',
          ],
          [
            Sequelize.literal(
              '( SELECT avatar FROM "Channels" WHERE "Channels"."id" =  "Subscription"."channelId")',
            ),
            'avatar_path',
          ],
        ],
      });
    }

    let genres = await Genre.findAll({
      limit: 7,
      attributes: [
        'name',
        [
          Sequelize.literal(
            `( SELECT text FROM "Translations" WHERE "Translations"."object_id" =  "Genre"."id" AND "Translations"."object_type" =  'genre' AND "Translations"."languageId" =  ${lang} )`,
          ),
          'name',
        ],
      ],
    });

    return { subscriptions: subscription, genres };
  }

  async getVideos(user, lang, query) {
    console.log(query);
    let videoLimit = query.limit || 20;
    let page = query.page || 1;
    let genre = query.genre || null;
    let videos;

    if (genre) {
      videos = await Video.findAll({
        limit: videoLimit,
        offset: (page - 1) * videoLimit,
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
    } else {
      videos = await Video.findAll({
        limit: videoLimit,
        offset: (page - 1) * videoLimit,
        where: { status: 'ok' },
        attributes: [
          ['publicId', 'id'],
          'title',
          'video_path',
          'views',
          'thumbnail',
          'channelId',
          'createdAt',
        ],
        include: {
          model: Channel,
          attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
        },
      });
    }

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
              '( SELECT COUNT(*) FROM "Subscriptions" WHERE "Subscriptions"."channelId" =  "Channel"."id")',
            ),
            'subscribeCount',
          ],

          [
            Sequelize.literal(
              `(SELECT EXISTS (SELECT * FROM "Subscriptions" WHERE "Subscriptions"."channelId" = "Channel"."id" AND "Subscriptions"."userId" = ${user.id}))`,
            ),
            'isSubsCribe',
          ],
          ['publicId', 'id'],
        ],
        exclude: ['updatedAt', 'createdAt', 'description', 'profilePhoto'],
      },
    });
    return { channels };
  }

  async getChannel(id: string, req: any): Promise<any> {
    const page = req.query.page || 1;
    const user = req.user;
    const limitOfVideo = 15;

    const channel = await Channel.findOne({
      where: { publicId: id },
      attributes: {
        exclude: ['updatedAt', 'userId'],

        include: [
          [
            Sequelize.literal(
              '( SELECT COUNT(*) FROM "Subscriptions" WHERE "Subscriptions"."channelId" =  "Channel"."id")',
            ),
            'subscribeCount',
          ],
          [
            Sequelize.literal(
              `(SELECT EXISTS (SELECT * FROM "Subscriptions" WHERE "Subscriptions"."channelId" = "Channel"."id" AND "Subscriptions"."userId" = ${user.id}))`,
            ),
            'isSubsCribe',
          ],
          ['publicId', 'publicId'],
        ],
      },
      group: ['Channel.id'],
    });

    // const videos = await channel.getVideos({
    //   limit: limitOfVideo,
    //   where: { status: 'ok' },
    //   offset: limitOfVideo * (page - 1),
    //   attributes: {
    //     exclude: ['updatedAt', 'description', 'channelId', 'video_path'],
    //   },
    // });

    const plainedChannel = channel.get({ plain: true });
    plainedChannel.id = plainedChannel.publicId;
    delete plainedChannel['publicId'];
    return { channel };
  }

  async videoid(id: string, req: any) {
    const page = req.query.page || 1;
    const user = req.user;

    try {
      let video = await Video.findOne({
        where: { publicId: id, status: 'ok' },
        attributes: [
          'id',
          'title',
          'views',
          'channelId',
          'description',
          'thumbnail',
          'duration',
          'video_path',

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
          'publicId',
        ],
        // },
      });
      video.views++;
      video.save();

      const channel = await video.getChannel({
        attributes: {
          exclude: [
            'profilePhoto',
            'description',
            'createdAt',
            'updatedAt',
            'userId',
            'genreId',
          ],
          include: [
            [
              Sequelize.literal(
                '( SELECT COUNT(*) FROM "Subscriptions" WHERE "Subscriptions"."channelId" =  "Channel"."id")',
              ),
              'subscribeCount',
            ],
            [
              Sequelize.literal(
                `(SELECT EXISTS (SELECT * FROM "Subscriptions" WHERE "Subscriptions"."channelId" = "Channel"."id" AND "Subscriptions"."userId" = ${user.id}))`,
              ),
              'isSubsCribe',
            ],
          ],
        },
      });

      const comments = await video.getComment({
        where: { parent: null },
        attributes: {
          exclude: ['updatedAt', 'videoId', 'parent'],
        },
        include: [
          {
            model: User,
            attributes: ['username', 'avatar'],
          },
        ],
      });

      const gettingComments = [];

      for (let comm of comments) {
        const plainedComments = comm.get({ plain: true });
        const childs = await Comment.findAll({
          where: { parent: comm.id },
          attributes: ['id', 'userId', 'parent', 'text'],
          include: [
            {
              model: User,
              attributes: ['username', 'avatar'],
            },
          ],
        });
        plainedComments['childs'] = childs;
        gettingComments.push(plainedComments);
      }
      if (user.id > 0) {
        const history = await UserHistory.findOrCreate({
          where: { userId: user.id, videoId: video.id },
        });
      }

      const toPlained = video.get({ plain: true });
      delete toPlained['id'];
      delete toPlained['updatedAt'];
      toPlained['id'] = toPlained.publicId;
      delete toPlained['publicId'];

      const channelPlained = channel.get({ plain: true });
      channelPlained.id = channelPlained.publicId;
      delete channelPlained['publicId'];

      return { video, channel, comments: gettingComments };
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
          include: [
            {
              model: Channel,
              required: false,
              attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
            },
          ],
          attributes: {
            include: [['publicId', 'id']],
            exclude: [
              'description',
              'updatedAt',
              'genreId',
              'publicId',
              'channelId',
            ],
          },
        },
      ],
      attributes: { exclude: ['userId', 'updatedAt', 'createdAt', 'videoId'] },
    });

    return { history };
  }

  async fLikedVideos(user: any) {
    const user1 = await User.findByPk(user.id);
    const liked = await user1.getLikes({
      where: { reaction: 'like' },
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar', ['publicId', 'id']],
            },
          ],
          attributes: {
            include: [['publicId', 'id']],
            exclude: [
              'description',
              'updatedAt',
              'genreId',
              'channelId',
              'id',
              'publicId',
            ],
          },
        },
      ],
      attributes: [],
      // exclude: ['createdAt', 'userId', 'updatedAt', 'reaction', 'videoId'],
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
          include: [
            {
              model: Channel,
              required: false,
              attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
            },
          ],
          attributes: {
            include: [['publicId', 'id']],
            exclude: [
              'description',
              'updatedAt',
              'genreId',
              'publicId',
              'channelId',
            ],
          },
        },
      ],
      attributes: { exclude: ['userId', 'updatedAt', 'createdAt', 'videoId'] },
    });
    const liked = await user1.getLikes({
      where: { reaction: 'like' },
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar', ['publicId', 'id']],
            },
          ],
          attributes: {
            include: [['publicId', 'id']],
            exclude: [
              'description',
              'updatedAt',
              'genreId',
              'channelId',
              'id',
              'publicId',
            ],
          },
        },
      ],
      attributes: [],
      // exclude: ['createdAt', 'userId', 'updatedAt', 'reaction', 'videoId'],
    });

    const playlist = await user1.getUserPlaylists({
      include: [
        {
          model: Video,
          required: false,
          where: { status: 'ok' },
          include: [
            {
              model: Channel,
              required: false,
              attributes: ['channel_name', 'avatar', ['publicId', 'id']],
            },
          ],
          through: {
            attributes: [],
          },
          attributes: {
            include: [['publicId', 'id']],
            exclude: [
              'description',
              'updatedAt',
              'genreId',
              'channelId',
              'id',
              'publicId',
            ],
          },
        },
      ],
      attributes: {
        exclude: ['userId', 'description', 'createdAt', 'updatedAt'],
      },
    });
    return { history, playlist, liked };
  }
}
