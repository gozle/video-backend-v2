import {
  Controller,
  Get,
  Param,
  Response,
  Request,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getUserInfo } from './common/guards/getUserInfo.guard';
import { AuthGuard } from './common/guards/auth.guard';
import { GetLanguage } from './validation/getLanguage.guard';

@ApiTags('main')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(getUserInfo)
  @ApiHeader({ name: 'access_token' })
  @ApiHeader({ name: 'accept-language' })
  @Get('main')
  getMain(@Request() req: any): Promise<any> {
    return this.appService.getMain(req.user, req.lang);
  }

  @UseGuards(getUserInfo)
  @ApiHeader({ name: 'access_token', required: false })
  @Get('channels')
  getChannels(@Request() req: any): Promise<any> {
    return this.appService.getChannels(req.user);
  }

  @UseGuards(getUserInfo)
  @Get('video/:id')
  @ApiHeader({ name: 'access_token', required: false })
  @ApiQuery({ name: 'page', required: false })
  videowithid(@Param('id') id: number, @Request() req: any): Promise<any> {
    return this.appService.videoid(id, req);
  }

  @UseGuards(getUserInfo)
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
