import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobController } from './job.controller';
import { JobProcessor } from './job.processor';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'job',
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASS'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [JobController],
  providers: [JobProcessor],
})
export class JobModule {}
