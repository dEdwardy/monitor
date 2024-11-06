import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  data: T;
  status: HttpStatus;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  logger = new Logger('http-service');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();
    const excludePath = ['/status'];
    if (excludePath.includes(req.url)) {
      return next.handle();
    }
    const requestId = nanoid();
    req.id = requestId;
    return next.handle().pipe(
      map((data) => {
        const info = {
          data: data ? data : null,
          requestId,
          status: data?.status ?? 200,
        };
        return info;
      }),
    );
  }
}
