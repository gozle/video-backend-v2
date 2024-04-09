import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Channel } from 'src/models/channel.model';
import { Comment } from 'src/models/comment.model';
import { Like } from 'src/models/like.model';
import { UserPlaylist } from 'src/models/playlistUser.model';
import { Subscription } from 'src/models/subscription.model';
import { User } from 'src/models/user.model';
import { Video } from 'src/models/video.model';

@Injectable()
export class UserService {
  //////////////////////////////////////////////////////////////////////////////////
  //Video Reaction
  //////////////////////////////////////////////////////////////////////////////////

  async addReaction(
    userId: number,
    videoId: string,
    reaction: string,
  ): Promise<any> {
    const video = await Video.findOne({ where: { publicId: videoId } });

    const addReact = await Like.findOne({
      where: { userId, videoId: video.id },
    });

    if (addReact) {
      if (reaction == addReact.reaction) {
        await addReact.destroy();
      } else {
        await addReact.update({ reaction });
      }
    } else {
      await Like.create({ userId, videoId: video.id, reaction });
    }

    return { message: 'succesfully' };
  }

  //////////////////////////////////////////////////////////////////////////////////
  //Subscribe
  //////////////////////////////////////////////////////////////////////////////////

  async subscribe(userId: number, channelId: string) {
    const chanel = await Channel.findOne({ where: { publicId: channelId } });
    const subscribe = await Subscription.findOne({
      where: {
        userId,
        channelId: chanel.id,
      },
    });

    if (subscribe) {
      await subscribe.destroy();
      return { isSubscribe: false };
    } else {
      await Subscription.create({ userId, channelId: chanel.id });
      return { isSubscribe: true };
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  //Playlist
  //////////////////////////////////////////////////////////////////////////////////

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

    const video = await Video.findOne({ where: { publicId: videoId } });

    playlist.addVideo(video);
    console.log(playlist);
  }

  async fuserDeletePlaylistVideo(playlistId: any, videoId: any, userId: any) {
    const playlist = await UserPlaylist.findByPk(playlistId);

    if (playlist.userId != userId) {
      throw new BadRequestException();
    }

    const video = await playlist.getVideo({ where: { publicId: videoId } });

    // console.log(video[0].UserPlaylistVideos);
    await video[0].UserPlaylistVideos.destroy();

    return { message: 'success' };
  }

  //////////////////////////////////////////////////////////////////////////////////
  //Comments
  //////////////////////////////////////////////////////////////////////////////////
  async fuserAddComment(videoId, userId, body, parentId) {
    try {
      const video = await Video.findOne({
        where: { publicId: videoId, status: 'ok' },
      });

      const comment = await Comment.create({
        text: body.text,
        videoId: video.id,
        userId: userId,
        parent: parentId,
      });
      return { mes: 'Succesfully' };
    } catch (err) {
      throw err;
    }
  }

  async fuserEditComment(videoId, userId, body, commentId) {
    try {
      const video = await Video.findOne({ where: { publicId: videoId } });
      console.log(userId);
      const comment = await video.getComment({
        where: { userId: userId, id: commentId },
      });

      comment[0].text = body.text;
      comment[0].save();
      return { mes: 'Succesfully' };
    } catch (err) {
      throw err;
    }
  }

  async fuserDeleteComment(videoId, userId, commentId) {
    try {
      const video = await Video.findOne({ where: { publicId: videoId } });

      const comment = await video.getComment({
        where: { userId: userId, id: commentId },
      });
      console.log(userId, videoId, commentId);
      comment[0].destroy();
      return { mes: 'Successfully' };
    } catch (err) {
      throw err;
    }
  }
}
