import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Render,
  UseInterceptors,
  UploadedFile,
  Header,
  Req,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import * as multer from 'multer';
import {
  VIDEO_DESTINATION,
  IMAGE_MIME_TIPES,
  THUMBNAIL_DESTINATION,
  VIDEO_MIME_TIPES,
} from './studio.constants';

const multerVideoOptions: {} = {
  storage: multer.diskStorage({
    destination: VIDEO_DESTINATION,
    filename: (req, file, cb) => {
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = VIDEO_MIME_TIPES;
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), false);
    }
  },
};

const multerThumbnailOptions: {} = {
  storage: multer.diskStorage({
    destination: THUMBNAIL_DESTINATION,
    filename: (req, file, cb) => {
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = IMAGE_MIME_TIPES;
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), false);
    }
  },
};

import { StudioService } from './studio.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

// @UseGuards()
@ApiTags('Studio')
@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////

  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        channel_name: {
          type: 'string',
        },
        description: {
          type: ' string',
        },
        avatar: {
          type: 'file',
        },
        profilePhoto: {
          type: 'file',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'profilePhoto', maxCount: 1 },
      ],
      multerThumbnailOptions,
    ),
  )
  @Post('channel/create')
  addChannelF(
    @Req() req: any,
    @Body() body: { name: string },
    @UploadedFiles() files: { avatar?: Express.Multer.File[] },
  ) {
    return this.studioService.faddChannel(files, req.user, body);
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////

  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token' })
  @Get('channels')
  getChannels(@Req() req: any) {
    return this.studioService.fgetChannels(req.user);
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'For video upload',
    description: "this endpoint is using in User's studio",
  })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'access_token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'file',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('video', multerVideoOptions))
  @Post('channel/:channelId/add/video')
  addVideo(
    @UploadedFile()
    files: {
      video?: Express.Multer.File;
    },
    @Body() body: any,
    @Req() req: any,
    @Param('channelId') channelId: string,
  ) {
    return this.studioService.faddVideo(files, req.user.id, channelId);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'For continuew uploading video upload',
    description: "this endpoint is using in User's studio",
  })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'access_token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        playlistId: {
          type: 'number',
        },
        thumbnail: {
          type: 'file',
        },
        genreId: {
          type: 'number',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('thumbnail', multerThumbnailOptions))
  @Post('channel/:channelId/add/video/:videoId/settings')
  addSettingVideo(
    @UploadedFile()
    file: {
      thumbnail?: Express.Multer.File;
    },
    @Body() body: any,
    @Req() req: any,
    @Param('channelId') channelId: string,
    @Param('videoId') videoId: string,
    @Query('uploadToken') uploadToken: string,
  ) {
    return this.studioService.faddVideoSetting(
      body,
      file,
      req.user.id,
      channelId,
      videoId,
      uploadToken,
    );
  }

  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  })
  @Post('channel/:channelId/add-playlist')
  addPlaylistChannelF(
    @Param('channelId') channelId: string,
    @Req() req: any,
    @Body() body: { name: string },
  ) {
    return this.studioService.faddChannelPlaylist(channelId, req.user, body);
  }
}
