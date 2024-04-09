import { Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { Channel } from 'src/models/channel.model';
import { Video } from 'src/models/video.model';

@Injectable()
export class VideoService {
  async fRelatedVideos(videoId: string, type: string) {
    const video = await Video.findOne({ where: { publicId: videoId } });
    if (type === 'channel') {
      const videos = await Video.findAll({
        where: { channelId: video.channelId, [Op.not]: { id: video.id } },
        include: {
          model: Channel,
          attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
        },
        attributes: {
          include: [['publicId', 'id']],
          exclude: [
            'channelId',
            'status',
            'description',
            'genreId',
            'publicId',
            'updatedAt',
          ],
        },
      });
      return { videos };
    }
    if (type === 'genre') {
      const videos = await Video.findAll({
        where: { genreId: video.genreId, [Op.not]: { id: video.id } },
        include: {
          model: Channel,
          attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
        },
        attributes: {
          include: [['publicId', 'id']],
          exclude: [
            'channelId',
            'status',
            'description',
            'genreId',
            'publicId',
            'updatedAt',
          ],
        },
      });
      return { videos };
    }

    const videos = await Video.findAll({
      where: { [Op.not]: { id: video.id } },
      // [Op.not]: { id: video.id },
      include: {
        model: Channel,
        attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
      },
      attributes: {
        include: [['publicId', 'id']],
        exclude: [
          'channelId',
          'status',
          'description',
          'genreId',
          'publicId',
          'updatedAt',
        ],
      },
    });
    return { videos };
  }
}
