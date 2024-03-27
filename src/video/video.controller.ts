import {
  Response,
  Request,
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { statSync, createReadStream } from 'fs';
import { Reaction } from 'src/validation/reaction.validator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Video Tools')
@Controller('api')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('video/:videoId/related')
  @ApiOperation({
    summary: 'For related videos',
    description: 'need when open video',
  })
  videoRelated(@Param('videoId') videoId: number, @Query('type') type: string) {
    return this.videoService.fRelatedVideos(videoId, type);
  }
}
