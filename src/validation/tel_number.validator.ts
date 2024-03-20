import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { User } from '../models/user.model';
import { BadRequestException } from '@nestjs/common';


let err: string;

@ValidatorConstraint({ name: 'IsPhone', async: true })

export class IsPhone implements ValidatorConstraintInterface {
    async validate(args: number): Promise<boolean> {

        const available: number[] = [61, 62, 63, 64, 65, 71]
        const bs: number = Math.trunc(args / 1000000);

        if (available.indexOf(bs) == -1) {
            err = "Please enter valid number!";
            return false
        }
        const user: any = await User.findOne({ where: { tel_number: args } })

        if (user) {
            err = "This phone number already exists. Please try another one!";
            return false

        }


        return true
    }

    defaultMessage(args: ValidationArguments): string {
        return err;
    }
}