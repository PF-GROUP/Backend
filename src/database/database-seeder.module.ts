import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database.seeder.service';
import { TypeOfProperty } from '../modules/typeOfProperty/typeofproperty.entity';
import { Agency } from '../modules/agency/agency.entity';
import { Property } from '../modules/property/property.entity';
import { User } from '../modules/user/user.entity';
import { Images } from '../modules/images/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOfProperty, Agency, Property, User, Images]),
  ],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
