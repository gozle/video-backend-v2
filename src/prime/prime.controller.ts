import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrimeService } from './prime.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Prime')
@Controller('api/prime')
export class PrimeController {
  constructor(private readonly primeService: PrimeService) {}

  @Get('get-premium-plans')
  getPremiumPlans() {
    return this.primeService.fgetPrimes();
  }

  @Post('joinPrime')
  joinPrime() {
    return { working: 'Working now please wait' };
  }

  @Post('addPrimePlan')
  addPrimeTariff(@Body() body: any) {
    return this.primeService.faddPrimeTariff(body);
  }
}
