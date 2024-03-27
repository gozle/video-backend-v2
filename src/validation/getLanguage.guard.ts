import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { Language } from 'src/models/language.model';

@Injectable()
export class GetLanguage implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let lang = request.headers['accept-language'];

    if (lang.length > 2 || lang.length < 2) {
      lang = 'en';
    }

    const language = await Language.findOne({
      where: { shortName: lang },
      attributes: ['id', 'shortName'],
    });

    // console.log(language);

    request['langId'] = language;

    return true;
  }
}
