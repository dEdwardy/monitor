import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { nanoid } from 'nanoid';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger('http-exception');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const errorName = exception.name;
    const message = exception.message;
    const errorResponse: any = exception.getResponse();
    const errInfo = {
      requestId: nanoid(),
      status,
      path: req?.url ?? '',
      error: {
        name: errorName,
        message: errorResponse?.message ?? message,
      },
    };
    this.logger.error({
      ...errInfo,
      ip: req?.ip ?? '',
    });
    res.status(200).json(errInfo);
  }
}
