import {
  Injectable,
  UnauthorizedException,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as conf from '../../config/config.json';
import * as dotenv from 'dotenv';

dotenv.config();

const access_secret = process.env.accessSecret || conf.accessSecret;

@Injectable()
export class getUserInfo implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: Function) {
    const token = req.headers['access_token'] || null;
    if (!token) {
      req['user'] = { id: 0 };
    } else {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: access_secret,
        });
        req['user'] = payload;
        return next();
      } catch (err) {
        req['user'] = { id: 0 };
      }
    }
    return next();
  }
}
