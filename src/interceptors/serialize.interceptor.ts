import { CallHandler, NestInterceptor,ExecutionContext, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface ClassConstructor{
    new (...arg:any[]):{}
}

export function Serialize(dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}
 
export class SerializeInterceptor implements NestInterceptor{
    constructor (private readonly dto:any){}
    intercept(context:ExecutionContext,next:CallHandler):Observable<any>{
        // Run something before a request in handled
        // by the request handler

        //console.log('Im running before the handler',context);
        return next.handle().pipe(
            map((data:any)=>{
                // Run somthing before the response is send
                //console.log('Im running before response is sent out',data)
                return plainToClass(this.dto,data,{
                    excludeExtraneousValues:true
                });
            })
        )
        
    }
}