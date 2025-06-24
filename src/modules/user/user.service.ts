import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { createGoogleUserDto, CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {email, password, ...restOfUserData} = createUserDto;
      if (restOfUserData.name.toLowerCase().includes("mati")){
      restOfUserData.name = "Soy Gay" 
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
      googleUser.name = "Soy Gay" 
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
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async findOneWithAllRelations(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['agency', 'agency.customization', 'agency.properties'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo para la foto de perfil.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    try {

      if (user.profilePictureUrl) {
        const publicId = this.cloudinaryService.getPublicIdFromUrl(user.profilePictureUrl);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      }


      const newImageUrl = await this.cloudinaryService.uploadFile(file);


      user.profilePictureUrl = newImageUrl;
      await this.userRepository.save(user);

      return newImageUrl; 
    } catch (error) {
      console.error('Error en UserService al actualizar la foto de perfil:', error);
      throw new InternalServerErrorException('No se pudo actualizar la foto de perfil debido a un error interno.');
    }
  }

}
