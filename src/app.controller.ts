import {
  Controller,
  Get,
  Param,
  Response,
  Request,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from './common/guards/auth.guard';

@ApiTags('main')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiHeader({ name: 'access_token' })
  @ApiHeader({ name: 'accept-language' })
  @Get('sidebar')
  getSideBar(
    @Request() req: any,
    @Headers('accept-language') lang: string,
  ): Promise<any> {
    console.log(req.lang);
    return this.appService.getSideBar(req.user, req.lang);
  }

  @ApiOperation({
    summary: 'Getting videos',
    description: 'Getting all videos or main page videos from here!',
  })
  @ApiHeader({ name: 'access_token' })
  @ApiQuery({ name: 'limit', required: false, example: '20' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @Get('videos')
  getMain(
    @Request() req: any,
    @Query() query: { limit: string; genre: string; page: string },
  ): Promise<any> {
    return this.appService.getVideos(req.user, req.lang, query);
  }

  @ApiHeader({ name: 'access_token', required: false })
  @Get('channels')
  getChannels(@Request() req: any): Promise<any> {
    return this.appService.getChannels(req.user);
  }

  @Get('video/:id')
  @ApiHeader({ name: 'access_token', required: false })
  @ApiQuery({ name: 'page', required: false })
  videowithid(@Param('id') id: number, @Request() req: any): Promise<any> {
    return this.appService.videoid(id, req);
  }

  @ApiHeader({ name: 'access_token', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('channel/:id')
  getChannel(@Param('id') id: number, @Request() req: any): Promise<any> {
    return this.appService.getChannel(id, req);
  }

  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token', required: false })
  @Get('history')
  userGistory(@Request() req: any) {
    return this.appService.fUserHistory(req.user);
  }

  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token', required: false })
  @Get('liked')
  userLiked(@Request() req: any) {
    return this.appService.fLikedVideos(req.user);
  }
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'access_token', required: false })
  @Get('library')
  userLibrary(@Request() req: any) {
    return this.appService.fUserLibrary(req.user);
  }
}
