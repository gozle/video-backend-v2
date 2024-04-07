import { Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { Channel } from 'src/models/channel.model';
import { Video } from 'src/models/video.model';

@Injectable()
export class VideoService {
  async fRelatedVideos(videoId: number, type: string) {
    const video = await Video.findByPk(videoId);
    if (type === 'channel') {
      const videos = await Video.findAll({
        where: { channelId: video.channelId, [Op.not]: { id: video.id } },
        attributes: [
          'id',
          'title',
          'thumbnail',
          'views',
          'duration',
          'createdAt',
        ],
        include: {
          model: Channel,
          attributes: ['id', 'channel_name'],
        },
      });
      return { videos };
    }
    if (type === 'genre') {
      const videos = await Video.findAll({
        where: { genreId: video.genreId, [Op.not]: { id: video.id } },
        attributes: [
          'id',
          'title',
          'thumbnail',
          'views',
          'duration',
          'createdAt',
          'genreId',
        ],
        include: {
          model: Channel,
          attributes: ['id', 'channel_name'],
        },
      });
      return { videos };
    }

    const videos = await Video.findAll({
      where: {
        [Op.or]: { genreId: video.genreId, channelId: video.channelId },
        // [Op.not]: { id: video.id },
      },
      attributes: [
        'id',
        'title',
        'thumbnail',
        'views',
        'duration',
        'createdAt',
        'genreId',
      ],
      include: {
        model: Channel,
        attributes: ['id', 'channel_name'],
      },
    });
    return { videos };
  }
}
