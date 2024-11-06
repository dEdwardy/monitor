import { Module } from '@nestjs/common';
// import { DBModule } from 'src/db/db.module';
import { ErrorController } from './error.controller';
import { ErrorService } from './error.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ErrorModel } from './error.model';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  // imports: [DBModule],
  imports: [TypegooseModule.forFeature([ErrorModel]), AuthModule, HttpModule],
  controllers: [ErrorController],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
