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
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
    @Param('videoId') videoId: string,
    @Request() req: any,
  ) {
    return this.userService.addReaction(req.user.id, videoId, reaction);
  }
  /////////////////////////////////////////////////////////////////////////////////
  //Subscribe
  /////////////////////////////////////////////////////////////////////////////////

  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For subscribe/unsubscribe  in reaction',
  })
  @UseGuards(AuthGuard)
  @Post('/channel/:channelId/subscribe')
  addSubscribe(
    @Headers('access_token') token: string,
    @Param('channelId') channelId: string,
    @Request() req: any,
  ) {
    return this.userService.subscribe(req.user.id, channelId);
  }
  ////////////////////////////////////////////////////////////////////////////////
  //Playlist
  ////////////////////////////////////////////////////////////////////////////////
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

  /////////////////////////////////////////////////////////////////////////////////////////
  //Comment
  /////////////////////////////////////////////////////////////////////////////////////////

  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For add user comment',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
      },
    },
  })
  @ApiParam({ name: 'videoId' })
  @ApiQuery({ name: 'parent', required: false })
  @UseGuards(AuthGuard)
  @Post('/video/:videoId/add-comment')
  userAddComment(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('videoId') videoId: any,
    @Query('parent') parentId: string,
    @Body() body: any,
  ) {
    return this.userService.fuserAddComment(
      videoId,
      req.user.id,
      body,
      parentId,
    );
  }

  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For edit user comment',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
      },
    },
  })
  @ApiParam({ name: 'videoId' })
  @ApiParam({ name: 'commentId' })
  @UseGuards(AuthGuard)
  @Put('/video/:videoId/edit-comment/:commentId')
  userEditComment(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Body() body: any,
  ) {
    return this.userService.fuserEditComment(
      videoId,
      req.user.id,
      body,
      commentId,
    );
  }

  @ApiTags('User Actions')
  @ApiOperation({
    summary: 'For delete user comment',
  })
  @ApiParam({ name: 'videoId' })
  @ApiParam({ name: 'commentId' })
  @UseGuards(AuthGuard)
  @Delete('/video/:videoId/delete-comment/:commentId')
  userDeleteComment(
    @Headers('access_token') token: string,
    @Request() req: any,
    @Param('videoId') videoId: string,
    @Param('commentId') commentId: string,
    @Body() body: any,
  ) {
    return this.userService.fuserDeleteComment(videoId, req.user.id, commentId);
  }
}
