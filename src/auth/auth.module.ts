import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { getUserInfo } from 'src/common/middlewares/getUserInfo.midle';

@Module({
  imports: [DatabaseModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(getUserInfo)
      .forRoutes({ path: 'api/auth/get-info', method: RequestMethod.GET });
  }
}
