import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as conf from '../../config/config.json';
import * as dotenv from 'dotenv';

dotenv.config();

const access_secret = process.env.accessSecret || conf.accessSecret;

@Injectable()
export class getUserInfo implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.access_token || null;
    if (!token) {
      request['user'] = { id: 0 };
    } else {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: access_secret,
        });
        request['user'] = payload;
      } catch (err) {
        console.log(err);
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
