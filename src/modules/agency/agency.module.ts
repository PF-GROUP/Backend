import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './agency.entity';
import { UserModule } from '../user/user.module';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { AgencyGuard } from '../../guard/agency.guard';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agency, User]),
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [AgencyController],
  providers: [AgencyService, AgencyGuard],
  exports: [AgencyService],
})
export class AgencyModule {}
