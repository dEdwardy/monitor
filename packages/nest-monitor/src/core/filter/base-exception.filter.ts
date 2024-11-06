import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { nanoid } from 'nanoid';

// 捕获所有异常
@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  logger = new Logger('base-exception');
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errrorInfo = {
      requestId: nanoid(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };
    this.logger.error({
      ip: request?.ip ?? '',
      ...errrorInfo,
    });
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send(errrorInfo);
  }
}
