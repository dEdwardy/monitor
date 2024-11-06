import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { TagModule } from './modules/tag/tag.module';
import { SourcemapModule } from './modules/sourcemap/sourcemap.module';
import { ErrorModule } from './modules/error/error.module';
import { JobModule } from './modules/job/job.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypegooseModule } from 'nestjs-typegoose';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './modules/email/email.module';
import { TeamModule } from './modules/team/team.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { MailerModule } from '@nestjs-modules/mailer';
import MailConfig from './config/email';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Log4jsModule } from '@nestx-log4js/core';
import { SourceMap } from './modules/sourcemap/sourcemap.entity';
import { Project } from './modules/project/project.entity';
import { User } from './modules/user/user.entity';
import { Tag } from './modules/tag/tag.entity';

@Module({
  imports: [
    Log4jsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // nestjs-redis 没维护了 换用@liaoliaots/nestjs-redis
    // RedisModule.register({
    //   // port: parseInt(process.env.REDIS_PORT, 10),
    //   // host: process.env.HOST,
    //   // password: process.env.PASSWORD,
    //   // db: parseInt(process.env.REDIS_DB_INDEX, 10),
    //   name: 'redis',
    //   url: `redis://${process.env.HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB_INDEX}`,
    // }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          config: {
            url: `redis://${config.get('HOST')}:${config.get(
              'REDIS_PORT',
            )}/${config.get('REDIS_DB_INDEX')}`,
            password: `${config.get('REDIS_PASS')}`,
            onClientCreated: () => {
              console.log(
                'redis connected.......................................',
              );
            },
          },
        };
      },
    }),
    TypegooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = `mongodb://${config.get('MONGODB_USER')}:${config.get(
          'MONGODB_PASS',
        )}@${config.get('HOST')}:${config.get('MONGODB_PORT')}/${config.get(
          'MONGODB_DB',
        )}`;
        console.log(config, process.env.MONGODB_USER);
        console.log('fe_baseurl', config.get('FE_BASE_URL'));
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('HOST'),
          port: Number(config.get('MYSQL_PORT')),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASS'),
          database: config.get('MYSQL_DB_NAME'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    // 实例化并/或注册队列
    BullModule.registerQueueAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          name: 'queue',
          redis: {
            host: config.get('HOST'),
            port: parseInt(config.get('REDIS_PORT'), 10),
          },
        };
      },
    }),
    ErrorModule,
    UserModule,
    ProjectModule,
    TagModule,
    SourcemapModule,
    // JobModule,
    MailerModule.forRoot(MailConfig),
    EmailModule,
    // TeamModule,
    AuthModule,
    // TaskModule,
    // fix typeorm hotreload
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.HOST,
    //   port: Number(process.env.MYSQL_PORT),
    //   username: process.env.MYSQL_USERNAME,
    //   password: process.env.MYSQL_PASS,
    //   database: process.env.MYSQL_DB_NAME,
    //   // entities: ['dist/**/*.entity{.ts,.js}'],
    //   entities: [SourceMap, Project, User, Tag],
    //   synchronize: false,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
