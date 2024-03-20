import { Module } from '@nestjs/common';
import { StudioService } from './studio.service';
import { StudioController } from './studio.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}
