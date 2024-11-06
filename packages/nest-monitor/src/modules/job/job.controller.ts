import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';

@Controller('job')
@ApiTags('job')
export class JobController {
  constructor(@InjectQueue('job') private readonly jobQueue: Queue) {}

  @Post('transcode')
  async transcode() {
    await this.jobQueue.add(
      'transcode',
      {
        file: 'audio.mp3',
      },
      { delay: 1000 },
    );
  }
}
