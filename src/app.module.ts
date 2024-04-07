import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { UserModule } from './user/user.module';
import { PrimeModule } from './prime/prime.module';
import { StudioModule } from './studio/studio.module';
// import { ViewModule } from '@nestjs/common';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { getUserInfo } from './common/middlewares/getUserInfo.midle';
import { GetLanguage } from './common/middlewares/getLanguage.middle';

@Module({
  imports: [
    AuthModule,
    VideoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrimeModule,
    StudioModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(getUserInfo).forRoutes(AppController);
    consumer.apply(GetLanguage).forRoutes(AppController);
  }
}
