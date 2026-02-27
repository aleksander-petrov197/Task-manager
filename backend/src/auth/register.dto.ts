import { IsEmail, MinLength, IsNotEmpty, MaxLength, Max } from "class-validator";
export class RegisterDto{
    @IsEmail({},{message: 'Please enter a valid email address' })
    email: string;

    @IsNotEmpty()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @MaxLength(20,{message: 'Password cannot exceed 20 charcters'})
    password: string;
}