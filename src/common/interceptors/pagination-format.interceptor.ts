// src/common/interceptors/pagination-format.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // فقط در صورتی که داده‌ها یک آبجکت با خاصیت‌های data و total باشند
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'total' in data
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { data: results, total: count, ...rest } = data;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            results,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            count,
            ...rest,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }
}
