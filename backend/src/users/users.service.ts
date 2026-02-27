import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;
        const hashedPasword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({
            email,
            password: hashedPasword,
        })
        return await this.usersRepository.save(newUser);
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }
findOne(email: string) {
  return this.usersRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password'] // Explicitly list all fields including the hidden one
  });
}
}
