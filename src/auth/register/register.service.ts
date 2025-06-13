import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/User/user.entity';
import * as bcrypt from 'bcrypt';
import { Register } from './entities/register.entity';
import { Repository } from 'typeorm';
import { Agency } from 'src/Agency/agency.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private registerRepository: Repository<Register>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ) {}

  async create(createRegisterDto: CreateRegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createRegisterDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email ya registrado', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(createRegisterDto.password, 10);

    const user = this.userRepository.create({
      name: createRegisterDto.name,
      surname: createRegisterDto.surname,
      email: createRegisterDto.email,
      phone: createRegisterDto.phone,
      password: hashedPassword,
      rol: createRegisterDto.rol,
    });

    const savedUser = await this.userRepository.save(user);

    const agency = this.agencyRepository.create({
      name: createRegisterDto.agencyName,
      description: createRegisterDto.agencyDescription,
      cuit_dni_m: createRegisterDto.cuit_dni_m,
      agentUser: savedUser,
    });

    const savedAgency = await this.agencyRepository.save(agency);

    const register = this.registerRepository.create({
      ...createRegisterDto,
      password: hashedPassword,
      user: savedUser,
      agency: savedAgency,
    });

    return this.registerRepository.save(register);
  }

  findAll() {
    return this.registerRepository.find({
      relations: ['user', 'agency'],
    });
  }

  findOne(id: number) {
    return this.registerRepository.findOne({
      where: { id },
      relations: ['user', 'agency'],
    });
  }

  update(id: number, updateRegisterDto: UpdateRegisterDto) {
    return `This action updates a #${id} register`;
  }

  remove(id: number) {
    return `This action removes a #${id} register`;
  }
}
