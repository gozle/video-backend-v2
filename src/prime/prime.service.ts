import { Injectable } from '@nestjs/common';
import { Prime } from 'src/models/prime.model';

@Injectable()
export class PrimeService {
  async fgetPrimes() {
    const primes = await Prime.findAll();
    return { primes };
  }

  async faddPrimeTariff(body: any) {
    const name = body.name;
    const price = body.price;
    const time = body.time;
    const description = body.description;

    const prime = await Prime.create({});
  }
}
