import { Test, TestingModule } from '@nestjs/testing';
import { NodeMailerController } from './node-mailer.controller';

describe('NodeMailerController', () => {
  let controller: NodeMailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeMailerController],
    }).compile();

    controller = module.get<NodeMailerController>(NodeMailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
