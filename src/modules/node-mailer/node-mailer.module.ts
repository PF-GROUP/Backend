import { Module } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';
import { NodeMailerController } from './node-mailer.controller';

@Module({
  providers: [NodeMailerService],
  controllers: [NodeMailerController]
})
export class NodeMailerModule {}
