import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {  CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/User/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class LoginService {
   constructor(
      private jwtService: JwtService,
      @InjectRepository(User) // o tu entidad correspondiente
      private usersRepository: Repository<User>,
   ) {}
  async signIn(credentials: CreateLoginDto) {
    const findUser = await this.usersRepository.findOneBy({
      email: credentials.email,
    })

    if (!findUser) throw new BadRequestException ('Bad credentials');

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      findUser.password,
    );

    if (!passwordMatch) throw new BadRequestException ('Bad credentials');
    const payload = {
      id: findUser.id,
      email: findUser.id,
      isAdmin: findUser.isAdmin,
    }
    const token = this.jwtService.sign(payload);

    return
    
  }
  // create(createLoginDto: CreateLoginDto) {
  //   return 'This action adds a new login';
  // }

  // findAll() {
  //   return `This action returns all login`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} login`;
  // }

  // update(id: number, updateLoginDto: UpdateLoginDto) {
  //   return `This action updates a #${id} login`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} login`;
  // }
}
