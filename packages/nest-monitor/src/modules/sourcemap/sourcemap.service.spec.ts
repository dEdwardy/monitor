import { Test, TestingModule } from '@nestjs/testing';
import { SourcemapService } from './sourcemap.service';

describe('SourcemapService', () => {
  let service: SourcemapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourcemapService],
    }).compile();

    service = module.get<SourcemapService>(SourcemapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
