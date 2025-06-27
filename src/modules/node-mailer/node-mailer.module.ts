import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { NodeMailerController } from './node-mailer.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [NodeMailerService],
  controllers: [NodeMailerController],
  exports:[NodeMailerService]
})
export class NodeMailerModule {}
