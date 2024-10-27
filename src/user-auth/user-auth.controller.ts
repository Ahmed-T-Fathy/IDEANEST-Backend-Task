import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { SignInDTO} from './dtos/signin.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetUserDTO } from './dtos/get-user.dto';
import { Request } from 'express';
import { AuthGaurd } from '../auth/guards/auth.guard';
import { SignupDTO } from './dtos/signup.dto';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';

@Controller('')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('/signin')
  async login(@Body() data: SignInDTO) {
    return this.userAuthService.signin(data);
  }

  @Serialize(GetUserDTO)
  @UseGuards(AuthGaurd)
  @Get('/me')
  async me(@Req() req) {
    return await this.userAuthService.me(req);
  }

  @Post('/signup')
  async signup(@Body() data: SignupDTO) {
    return this.userAuthService.signup(data);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() data: RefreshTokenDTO) {
    return this.userAuthService.refreshToken(data.refresh_token);
  }

  @Post('/create-default-users')
  async createDefaultUsers() {
    return this.userAuthService.createDefaultUsers();
  }
}
