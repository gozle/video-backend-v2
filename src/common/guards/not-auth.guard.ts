// import {
//     CanActivate,
//     ExecutionContext,
//     ForbiddenException,
//     Injectable,
// } from '@nestjs/common';

// @Injectable()
// export class NotAuth implements CanActivate {

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = request.headers.access_token;
//         if (token) {
//             throw new ForbiddenException();
//         }
//         return true;
//     }

// }
