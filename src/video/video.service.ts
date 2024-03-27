import { Injectable } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { Op } from 'sequelize';
import { Like } from 'src/models/like.model';
import { Subscription } from 'src/models/subscription.model';
import { Video } from 'src/models/video.model';

@Injectable()
export class VideoService {
  async fRelatedVideos(videoId: number, type: string) {
    const video = await Video.findByPk(videoId);
    if (type === 'channel') {
      const videos = await video.getChannel({
        attributes: [],
        include: [
          {
            model: Video,
            attributes: [
              'id',
              'title',
              'thumbnail',
              'views',
              'duration',
              'createdAt',
            ],
          },
        ],
      });
      return { videos };
    }
    if (type === 'genre') {
      const videos = await Video.findAll({
        where: { genreId: video.genreId },
        attributes: [
          'id',
          'title',
          'thumbnail',
          'views',
          'duration',
          'createdAt',
          'genreId',
        ],
      });
      return { videos };
    }
    const videos = await Video.findAll({
      where: {
        [Op.or]: { genreId: video.genreId, channelId: video.channelId },
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
    });
    return { videos };
  }
}
