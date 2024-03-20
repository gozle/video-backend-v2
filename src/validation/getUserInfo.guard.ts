import {
    BadGatewayException,
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class getUserInfo implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.access_token || null;
        if (!token) {
            request['user'] = { id: 0 };
        } else {
            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: 'secret_gozle_video_premium'
                    }
                );
                request['user'] = payload;
            } catch (err) {
                console.log(err)

                throw new UnauthorizedException();
            }
        }

        return true;
    }

}