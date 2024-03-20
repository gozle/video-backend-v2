import { Module } from '@nestjs/common';
import { PrimeService } from './prime.service';
import { PrimeController } from './prime.controller';

@Module({
  controllers: [PrimeController],
  providers: [PrimeService],
})
export class PrimeModule {}
