import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class Reaction implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reaction = request.query.reaction;
    if (reaction === 'like' || reaction === 'dislike') {
      return true;
    } else {
      throw new UnprocessableEntityException();
    }
  }
}
