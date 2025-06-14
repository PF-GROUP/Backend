import { Module } from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { CustomizationController } from './customization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Agency } from 'src/Agency/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customization, Agency])
],
  controllers: [CustomizationController],
  providers: [CustomizationService],
  exports: [CustomizationService, TypeOrmModule],
})
export class CustomizationModule {}
