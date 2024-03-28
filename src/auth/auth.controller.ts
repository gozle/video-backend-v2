import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import * as CONSTANTS from './auth.constants';

import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { LoginDto } from './dto/login.dto';
import { RefreshToken } from 'src/common/guards/refresh-token.guard';

const multerOptions: {} = {
  storage: diskStorage({
    destination: 'uploads/avatars',
    filename: (req, file, cb) => {
      const filename = `${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = CONSTANTS.MIME_TIPES;
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), false);
    }
  },
};

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registration',
    description:
      'Registrasiya edenden son email`a verification link ugradylyar',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        conPassword: {
          type: 'string',
        },
        // tel: {
        //   type: 'number',
        // },
        avatar: {
          type: 'file',
        },
      },
      required: ['username', 'email', 'password', 'conPassword'], // Correct way to mark property1 as required
    },
  })
  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], multerOptions),
  )
  create(
    @Body() body: User,
    @UploadedFiles() file: { avatar?: Express.Multer.File[] },
  ) {
    let fl;
    if (file.avatar) {
      fl = file?.avatar[0].path || null;
    }
    return this.authService.createUser(body, fl);
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login eden son access_token we refresh_token berilyar',
  })
  @Post('login')
  login(@Body(new ValidationPipe()) body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(RefreshToken)
  @ApiOperation({
    summary: 'New access_token',
    description:
      'autoLogin refrsh_token ugrat taze access_token we refresh token berya',
  })
  @ApiHeader({ name: 'refresh_token' })
  @Get('/new-')
  async getNewToken(@Request() req) {
    return await this.authService.reNewToken(req.user);
  }

  @ApiOperation({ summary: 'Verify user Email' })
  @Get('verify/email/:token')
  async getVerify(
    @Req() req: any,
    @Res() res: any,
    @Param('token') token: string,
  ) {
    const resp = await this.authService.fgetVerify(token);
    return res.redirect(resp.statusCode || 302, resp.url);
  }
}
