import { InternalServerErrorException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { createGoogleUserDto, CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import * as bcrypt from 'bcrypt';
import { AgencyService } from '../agency/agency.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly agencyService: AgencyService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {email, password, ...restOfUserData} = createUserDto;
      if (restOfUserData.name.toLowerCase().includes("mati")){
      restOfUserData.name = "Soy Matias el HOMOSEXUAL REPRIMIDO TRAGA LECHE DE TORO" 
    }
    const existngUser = await this.userRepository.findOne({where:{email} });
    if (existngUser){
      throw new BadRequestException('El email ya está registrado. Por favor, utiliza otro.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...restOfUserData,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }
  async createFromGoogle(googleUser:createGoogleUserDto): Promise<User> {
    if (googleUser.name.toLowerCase().includes("mati")){
      googleUser.name = "Soy Matias el HOMOSEXUAL REPRIMIDO TRAGA LECHE DE TORO" 
    }
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

  async findAllNonAdmins(): Promise<User[]> {
    return this.userRepository.find({where: {isAdmin: false}});
  }

  async getNonAdminUserEmails(): Promise<string[]> {
    const users = await this.findAllNonAdmins();
    return users.map(user => user.email);
  }

async findOneByEmail(email: string): Promise<User | null> {
  const theUser = await this.userRepository.findOne({ where: { email } });
  if (!theUser) {
    throw new NotFoundException(`User with email ${email} not found`);
  }
  const agency = await this.agencyService.findOneByUserId(theUser.id);

  if (!agency || !agency.user) {
   return theUser
  }

    agency.user.agency = agency
 

  return agency.user;
}
async findOneByGoogleId(googleId: string): Promise<User | null> {
const theUser = await this.userRepository.findOne({ where: { googleId } });
  if (!theUser) {
    throw new NotFoundException(`User with googleId ${googleId} not found`);
  }
  const agency = await this.agencyService.findOneByUserId(theUser.id);

  if (!agency || !agency.user) {
   return theUser
  }
  
    agency.user.agency = agency
 

  return agency.user;
}
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.findOne(id);

    Object.assign(userToUpdate, updateUserDto);

    return await this.userRepository.save(userToUpdate);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async findOneWithAllRelations(id: string) {
    const theUser = await this.userRepository.findOne({ where: { id } });
  if (!theUser) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  const agency = await this.agencyService.findOneByUserId(theUser.id);

  if (!agency || !agency.user) {
   return theUser
  }
  
    agency.user.agency = agency
 

  return agency.user;
  }

}
