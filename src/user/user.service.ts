import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Sequelize from '@sequelize/core';
import { Like } from 'src/models/like.model';
import { UserPlaylist } from 'src/models/playlistUser.model';
import { Subscribe } from 'src/models/subscribe.model';
import { User } from 'src/models/user.model';
import { Video } from 'src/models/video.model';

@Injectable()
export class UserService {
  async addReaction(
    userId: number,
    videoId: number,
    reaction: string,
  ): Promise<any> {
    const addReact = await Like.findOne({
      where: { userId, videoId },
    });

    if (addReact) {
      if (reaction == addReact.reaction) {
        await addReact.destroy();
      } else {
        await addReact.update({ reaction });
      }
    } else {
      await Like.create({ userId, videoId, reaction });
    }

    return { message: 'succesfully' };
  }

  async subscribe(userId: number, channelId: number) {
    const subscribe = await Subscribe.findOne({
      where: {
        userId,
        channelId,
      },
    });
    if (subscribe) {
      await subscribe.destroy();
      return { isSubscribe: false };
    } else {
      await Subscribe.create({ userId, channelId });
      return { isSubscribe: true };
    }
  }

  async fUserPlaylists(userId: number) {
    const user = await User.findByPk(userId);
    const playlists = await user.getUserPlaylists({
      attributes: ['id', 'name'],
    });

    return { playlists };
  }

  async fUserPlaylistId(userId: number, playlistId: number) {
    const user = await User.findByPk(userId);
    const playlists = await user.getUserPlaylists({
      where: { id: playlistId },
      attributes: ['id', 'name'],
    });

    return { playlist: playlists[0] };
  }

  async fuserAddPlaylist(userId: number, body: any) {
    try {
      const user = await User.findByPk(userId);
      const playlist = await UserPlaylist.create({
        name: body.name,
        userId: user.id,
      });
      return { name: playlist.name, id: playlist.id };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async fuserUpdatePlaylist(playlistId: number, userId: number, body: any) {
    try {
      let description = body.description || null;
      let name = body.name || null;

      const playlist = await UserPlaylist.findByPk(playlistId);

      if (playlist.userId != userId) {
        throw new BadRequestException();
      }

      if (!name) {
        console.log(name);
        name = playlist.name;
      }

      if (description) {
        description = playlist.description;
      }

      await playlist.update({
        name: name,
        description: description,
      });
      return;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async fuserDeletePlaylist(playlistId: number, userId: number) {
    try {
      const playlist = await UserPlaylist.findByPk(playlistId);
      await playlist.destroy();
      return;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async fuserAddVideoPlaylist(playlistId: any, videoId: any, userId: any) {
    const playlist = await UserPlaylist.findByPk(playlistId);

    if (playlist.userId != userId) {
      throw new BadRequestException();
    }

    const video = await Video.findByPk(videoId);

    playlist.addVideo(video);
    console.log(playlist);
  }

  async fuserDeletePlaylistVideo(playlistId: any, videoId: any, userId: any) {
    const playlist = await UserPlaylist.findByPk(playlistId);

    if (playlist.userId != userId) {
      throw new BadRequestException();
    }

    const video = await playlist.getVideo({ where: { id: videoId } });

    // console.log(video[0].UserPlaylistVideos);
    await video[0].UserPlaylistVideos.destroy();

    return { message: 'success' };
  }
}
