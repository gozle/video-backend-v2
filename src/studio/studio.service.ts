import { ForbiddenException, Injectable } from '@nestjs/common';
import { Channel } from 'src/models/channel.model';
import { Video } from 'src/models/video.model';
import { deleteFile } from 'src/util/deleteFile';
import { getVideoDuration } from 'src/util/getVideoDuration';
import { JwtModule } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { ChannelPlaylist } from 'src/models/playlistChannel.model';

@Injectable()
export class StudioService {
  // constructor(private jwtService: JwtModule) {}
  async faddVideo(file, userId, channelId) {
    const channel = await Channel.findByPk(channelId);
    if (channel.userId !== userId) {
      deleteFile(file.path);
      throw new ForbiddenException();
    }
    let duration = await getVideoDuration(file.path);

    const video = await Video.create({
      video_path: file.path,
      duration: duration,
      channelId: channelId,
      status: 'upload',
    });

    const payload = { videoId: video.id, userId: userId, channelId: channelId };

    const uploadToken = jwt.sign(payload, 'signKey');

    const playlists = await channel.getChannelPlaylists({
      attributes: ['id', 'name'],
    });

    return { uploadToken, videoId: video.id, playlists };
  }

  async faddVideoSetting(body, file, user, channel, videoUUID, uploadToken) {
    const payload: any = jwt.verify(uploadToken, 'signKey');
    const video = await Video.findByPk(payload.videoId);
    // if (video.uuid != videoUUID || video.status == 'ok') {
    //   throw new ForbiddenException();
    // }

    video.update({
      title: body.title,
      genreId: body.genreId,
      description: body.description,
      thumbnail: file.path,
      status: 'ok',
    });

    const playlistId = body.playlistId || null;

    let playlist;
    if (playlistId) {
      playlist = await ChannelPlaylist.findByPk(playlistId);
      await playlist.addVideo(video);
    }

    return { message: 'Succesfully added' };
  }

  async faddChannelPlaylist(
    channelId: string,
    user: any,
    body: { name: string },
  ) {
    const channel = await Channel.findByPk(channelId);
    // const playlist = await ChannelPlaylist.create();
    const playlist = await ChannelPlaylist.create({
      name: body.name,
      channelId: channelId,
    });

    console.log(playlist);
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

    const channel = await Channel.create({
      channel_name: body.channel_name,
      description: body.description,
      avatar: avatar,
      profilePhoto: profilePhoto,
      userId: user.id,
    });
    return { channelId: channel.id };
  }

  async fgetChannels(user) {
    const channels = await Channel.findAll({
      where: { userId: user.id },
      attributes: ['id', 'channel_name', 'avatar'],
    });
    return { channels };
  }
  async fgetChannelById(id, user) {
    const channels = await Channel.findByPk(id, {
      attributes: ['id', 'channel_name', 'avatar'],
    });
    return { channels };
  }
}
