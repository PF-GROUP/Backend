import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { createGoogleUserDto, CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async createFromGoogle(googleUser:createGoogleUserDto): Promise<User> {
    const user = this.userRepository.create(googleUser);
    return await this.userRepository.save(user);
  }
  async updateFromGoogle(googleUser:createGoogleUserDto): Promise<User> {
    const user = this.userRepository.create(googleUser);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['agency', 'agency.customization', 'agency.properties'] });
    if (!user) {
return null   
}


    return user;
  }
async findOneByGoogleId(googleId: string): Promise<User | null> {
  return await this.userRepository.findOne({ where: { googleId },
    relations: ['agency', 'agency.customization', 'agency.properties'],
   });
}
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async findOneWithAllRelations(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['agency', 'agency.customization', 'agency.properties'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
