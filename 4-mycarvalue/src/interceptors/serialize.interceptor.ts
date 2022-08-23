import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

// Type for 'any class'
interface ClassConstructor {
  new (...args: any[]);
}

// This is just a function
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<ClassConstructor> {
    // Runs before a request is handled
    console.log("I'm running before the handler");

    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        // Runs before the request is sent - data is still an instance of an Entity
        console.log("I'm running before the request is sent out", data);
        // plainToClass is going to turn an entity into a DTO - its not yet a string!
        return plainToInstance(this.dto, data, {
          // The dto we pass can omit non-required options
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
