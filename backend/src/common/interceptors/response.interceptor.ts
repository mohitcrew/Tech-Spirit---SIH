import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'; import { map, Observable } from 'rxjs';
@Injectable() export class ResponseInterceptor implements NestInterceptor { intercept(_:ExecutionContext,next:CallHandler):Observable<any>{return next.handle().pipe(map(data=>data?.success===false?data:{success:true,message:'Request successful',data}))} }
