import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsByteLength, IsEmail } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsByteLength(8, 64, { message: 'Password must be between 8 and 64 characters!' })
    password: string
}