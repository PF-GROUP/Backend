import { Module } from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { CustomizationController } from './customization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Agency } from 'src/modules/agency/agency.entity';
import { AgencyOwnershipGuard } from 'src/guard/agencyOwnership.guard';
import { AgencyService } from '../agency/agency.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Customization, Agency])
],
  controllers: [CustomizationController],
  providers: [CustomizationService, AgencyOwnershipGuard, AgencyService, UserService, JwtService, AuthGuard, RolesGuard],
  exports: [CustomizationService, TypeOrmModule],
})
export class CustomizationModule {}
