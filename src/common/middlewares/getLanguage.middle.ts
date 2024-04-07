import { Injectable, NestMiddleware } from '@nestjs/common';

import { Language } from 'src/models/language.model';

@Injectable()
export class GetLanguage implements NestMiddleware {
  async use(req: Request, res: Response, next: Function): Promise<boolean> {
    let lang = req.headers['accept-language'];

    if (lang.length > 2 || lang.length < 2) {
      lang = 'en';
    }

    const language = await Language.findOne({
      where: { shortName: lang },
      attributes: ['id', 'shortName'],
    });

    req['lang'] = language.id;

    return next();
  }
}
