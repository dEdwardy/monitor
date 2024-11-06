import { Test, TestingModule } from '@nestjs/testing';
import { SourcemapController } from './sourcemap.controller';

describe('SourcemapController', () => {
  let controller: SourcemapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SourcemapController],
    }).compile();

    controller = module.get<SourcemapController>(SourcemapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
