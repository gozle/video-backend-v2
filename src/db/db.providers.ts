import { Sequelize } from 'sequelize-typescript';
import { IDatabaseConfigAttributes } from './db.interface';
import { dataBaseConfig } from './db.config';
import { User } from '../models/user.model';
// import { Channel } from 'src/models/channel.model';
import { UserHistory } from 'src/models/userHistory.model';
import { Video } from 'src/models/video.model';
import { Comment } from 'src/models/comment.model';
import { Like } from 'src/models/like.model';
import { Prime } from 'src/models/prime.model';
import { Tags } from 'src/models/tags.model';
import { VideoTags } from 'src/models/videoTags.model';
import { Channel } from 'src/models/channel.model';
import { Subscribe } from 'src/models/subscribe.model';
import { Genre } from 'src/models/genre.model';
import { UserPlaylist } from 'src/models/playlistUser.model';
import { UserPlaylistVideos } from 'src/models/userPlaylistVideos.model';
import { ChannelPlaylist } from 'src/models/playlistChannel.model';
import { ChannelPlaylistVideos } from 'src/models/channelPlaylistVideos';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config: IDatabaseConfigAttributes = dataBaseConfig.dev;
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        UserHistory,
        Video,
        Comment,
        Like,
        Prime,
        Tags,
        VideoTags,
        Channel,
        Subscribe,
        Genre,
        UserPlaylist,
        UserPlaylistVideos,
        ChannelPlaylist,
        ChannelPlaylistVideos,
      ]);
      // await sequelize.sync({ force: true });
      await sequelize.sync({ alter: true });
      // await sequelize.sync();
      return sequelize;
    },
  },
];
