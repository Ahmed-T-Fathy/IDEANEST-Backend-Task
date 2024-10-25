import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token is requried!');
    }
    try {

      const payload = await this.jwtService.verify(token);

      if (!payload) throw new UnauthorizedException('In valid token!');
      const user = await this.userService.getUserById(payload.id);
      
      request['user'] = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
