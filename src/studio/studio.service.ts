import { ForbiddenException, Injectable } from '@nestjs/common';
import { Channel } from 'src/models/channel.model';
import { Video } from 'src/models/video.model';
import { deleteFile } from 'src/util/deleteFile';
import { getVideoDuration } from 'src/util/getVideoDuration';
import * as jwt from 'jsonwebtoken';
import { ChannelPlaylist } from 'src/models/playlistChannel.model';
import * as dotenv from 'dotenv';
import { generateKeyLength } from './studio.constants';
import { generateStrongKey } from 'src/util/generateId';
import { Genre } from 'src/models/genre.model';

dotenv.config();

const video_secret = process.env.VIDEO_UPLOAD_SECRET;

@Injectable()
export class StudioService {
  // constructor(private jwtService: JwtModule) {}
  async faddVideo(file, userId, channelId) {
    if (!file) {
      throw new ForbiddenException();
    }
    const channel = await Channel.findOne({ where: { publicId: channelId } });
    if (channel.userId !== userId) {
      deleteFile(file.path);
      throw new ForbiddenException();
    }
    let duration = await getVideoDuration(file.path);
    const pubId = generateStrongKey(generateKeyLength);

    const video = await Video.create({
      video_path: file.path,
      duration: duration,
      channelId: channel.id,
      status: 'upload',
      publicId: pubId,
    });

    const payload = {
      videoPubId: video.publicId,
      videoId: video.id,
      userId: userId,
      channelId: channelId,
    };

    const uploadToken = jwt.sign(payload, video_secret);

    const playlists = await channel.getChannelPlaylists({
      attributes: ['id', 'name'],
    });

    const genres = await Genre.findAll({
      attributes: ['id', 'name'],
    });

    return { uploadToken, videoId: video.publicId, playlists };
  }

  async faddVideoSetting(body, file, userId, channelId, videoId, uploadToken) {
    try {
      const payload: any = jwt.verify(uploadToken, video_secret);
      console.log(payload.publicId, videoId);
      if (payload.videoPubId != videoId) {
        throw new ForbiddenException({ msg: 'Invalid video id' });
      }
      const video = await Video.findOne({
        where: { publicId: payload.videoPubId },
        include: { model: Channel, attributes: ['id', 'publicId'] },
      });

      if (video.status != 'upload' || channelId != video.channel.publicId) {
        if (file) {
          deleteFile(file.path);
        }
        throw new ForbiddenException({
          msg: 'Invalid video configurations or alrea',
        });
      }

      let thumbnail = null;
      if (file) {
        thumbnail = file.path;
      }

      video.update({
        title: body.title,
        genreId: body.genreId,
        description: body.description,
        thumbnail: thumbnail,
        status: 'ok',
      });

      const playlistId = body.playlistId || null;

      let playlist;
      if (playlistId) {
        playlist = await ChannelPlaylist.findByPk(playlistId);
        await playlist.addVideo(video);
      }

      return { message: 'Succesfully added' };
    } catch (err) {
      throw err;
    }
  }

  async faddChannelPlaylist(
    channelId: string,
    user: any,
    body: { name: string },
  ) {
    const channel = await Channel.findOne({
      where: { publicId: channelId, userId: user.id },
    });
    const playlist = await ChannelPlaylist.create({
      name: body.name,
      channelId: channel.id,
    });

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
      },
    };
  }

  async faddChannel(files, user, body) {
    let avatar = null,
      profilePhoto = null;

    if (files?.avatar) avatar = files?.avatar[0]?.path;
    if (files?.profilePhoto) profilePhoto = files?.profilePhoto[0]?.path;

    const pubId = generateStrongKey(generateKeyLength);

    const channel = await Channel.create({
      channel_name: body.channel_name,
      description: body.description,
      avatar: avatar,
      profilePhoto: profilePhoto,
      userId: user.id,
      publicId: pubId,
    });
    return { channelId: channel.publicId };
  }

  async fgetChannels(user) {
    const channels = await Channel.findAll({
      where: { userId: user.id },
      attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
    });
    return { channels };
  }
  async fgetChannelById(id, user) {
    const channels = await Channel.findOne({
      where: { publicId: id },
      attributes: [['publicId', 'id'], 'channel_name', 'avatar'],
    });
    return { channels };
  }
}
