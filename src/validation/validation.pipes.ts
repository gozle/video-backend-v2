import { ValidationPipe as BaseValidationPipe, BadRequestException } from '@nestjs/common';

export class ValidationPipe extends BaseValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors) => new BadRequestException(errors),
        });
    }
}