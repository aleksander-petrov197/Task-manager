import { BadRequestException, Injectable,UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ){}

    async login(email: string, pass: string){
        const user = await this.usersService.findOne(email);
         if(user && (await bcrypt.compare(pass, user.password))){
        const payload = {email: user.email, sub: user.id};
        return{
            access_token: this.jwtService.sign(payload),
        };
    }
    throw new UnauthorizedException('Invalid credentials');
    };

    async register(registerDto: RegisterDto) {
  if (registerDto.email.toLowerCase() === registerDto.password.toLowerCase()) {
    throw new BadRequestException('Password cannot be the same as your email address');
  }

}
}
