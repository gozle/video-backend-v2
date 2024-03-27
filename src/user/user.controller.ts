import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Reaction } from 'src/validation/reaction.validator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For like/dislike. Write like or dislike in reaction',
  })
  @UseGuards(Reaction)
  @UseGuards(AuthGuard)
  @Post('/video/:videoId/reaction')
  addReaction(
    @Query('reaction') reaction: string,
    @Headers('access_token') token: string,
    @Param('videoId') videoId: number,
    @Request() req: any,
  ) {
    return this.userService.addReaction(req.user.id, videoId, reaction);
  }

  //Subscribe
  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For subscribe/unsubscribe  in reaction',
  })
  @UseGuards(AuthGuard)
  @Post('/channel/:channelId/subscribe')
  addSubscribe(
    @Headers('access_token') token: string,
    @Param('channelId') channelId: number,
    @Request() req: any,
  ) {
    return this.userService.subscribe(req.user.id, channelId);
  }

  //Playlist
  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For get user playlists',
  })
  @UseGuards(AuthGuard)
  @Get('/user/playlist/:playlistId')
  userPlaylistId(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('playlistId') playlistId: number,
  ) {
    return this.userService.fUserPlaylistId(req.user.id, playlistId);
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For get user playlist',
  })
  @UseGuards(AuthGuard)
  @Get('/user/playlists')
  userPlaylists(@Headers('access_token') token: string, @Request() req: any) {
    return this.userService.fUserPlaylists(req.user.id);
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For create New user playlist',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['name'],
    },
  })
  @UseGuards(AuthGuard)
  @Post('/user/playlist/add')
  userAddPlaylist(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.userService.fuserAddPlaylist(req.user.id, body);
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For update user playlist',
  })
  @ApiParam({ name: 'playlistId' })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
      required: ['name'],
    },
  })
  @UseGuards(AuthGuard)
  @Patch('/user/playlist/:playlistId/update')
  userUpdatePlaylist(
    @Headers('access_token') token: string,
    @Param('playlistId') playlistId: any,
    @Request() req: any,
    @Body() body: any,
  ) {
    return this.userService.fuserUpdatePlaylist(playlistId, req.user.id, body);
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For delete user playlist',
  })
  @ApiParam({ name: 'playlistId' })
  @UseGuards(AuthGuard)
  @Delete('/user/playlist/:playlistId/delete')
  userDeletePlaylist(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('playlistId') playlistId: any,
  ) {
    return this.userService.fuserDeletePlaylist(playlistId, req.user.id);
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For add video to user playlist',
  })
  @ApiParam({ name: 'playlistId' })
  @ApiParam({ name: 'videoId' })
  @UseGuards(AuthGuard)
  @Post('/user/playlist/:playlistId/addVideo/:videoId')
  userAddVideoToPlaylist(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('playlistId') playlistId: any,
    @Param('videoId') videoId: any,
  ) {
    return this.userService.fuserAddVideoPlaylist(
      playlistId,
      videoId,
      req.user.id,
    );
  }

  @ApiTags('User Playlist')
  @ApiOperation({
    summary: 'For delete user playlist',
  })
  @ApiParam({ name: 'playlistId' })
  @ApiParam({ name: 'videoId' })
  @UseGuards(AuthGuard)
  @Delete('/user/playlist/:playlistId/deleteVideo/:videoId')
  userDeletePlaylistVideo(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('playlistId') playlistId: any,
    @Param('videoId') videoId: any,
  ) {
    return this.userService.fuserDeletePlaylistVideo(
      playlistId,
      videoId,
      req.user.id,
    );
  }
}
