import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { User } from '../models/user.model';

let err: string;
@ValidatorConstraint({ name: 'EmailInDb', async: true })
export class EmailInDb implements ValidatorConstraintInterface {
  async validate(
    args: string,
    username: ValidationArguments,
  ): Promise<boolean> {
    const [relatedPropertyName] = username.constraints;
    const relatedValue = (username.object as any)[relatedPropertyName];

    let user: any = await User.findOne({ where: { email: args } });
    if (user && user.isVerify) {
      err = 'This e-mail address already exists. Please try another one!';
      return false;
    }

    user = await User.findOne({ where: { username: relatedValue } });
    if (user) {
      err = 'This username alreade exists. Please try another one!';
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return err;
  }
}
