import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ACCESSLEVEL_KEY } from "../decorators/access-level.decorator";
import { AccessLevel } from "../../user/access-level.enum";

@Injectable()
export class AccessLevelGuard implements CanActivate{
    constructor(private reflector :Reflector){}
    canActivate(context: ExecutionContext): boolean{
        const requiredAccessLevel = this.reflector.getAllAndOverride(
          ACCESSLEVEL_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );

        if(!requiredAccessLevel)return true;
        
        const {user}=context.switchToHttp().getRequest();

        
        if (requiredAccessLevel.includes(user.access_level)) {
          return true;
        } else throw new UnauthorizedException();
    }
}