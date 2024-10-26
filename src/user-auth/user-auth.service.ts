import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignInDTO } from './dtos/signin.dto';
import { access } from 'fs';
import { Request } from 'express';
import { CreateUserDTO } from 'src/user/dots/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SignupDTO } from './dtos/signup.dto';
import { AccessLevel } from 'src/user/access-level.enum';

@Injectable()
export class UserAuthService {
  constructor(private readonly userService: UserService) {}

  async signin(data: SignInDTO) {
    try {
      const user = await this.userService.getUserByEmail(data.email);

      await user.validatePassword(data.password);

      const tokens = await user.generateToken();
      user.refreshToken = tokens.refresh_token;
      await user.save();

      return {
        message: 'success',
        ...tokens,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async me(req: Request & UserInRequest) {
    try {
      return req.user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async signup(data: SignupDTO) {
    try {
      await this.userService.createUser({
        ...data,
        access_level: AccessLevel.Read_Only,
      });
      return {
        message: 'success',
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = await this.userService.getUserByToken(refreshToken);

      const tokens = await user.generateToken();
      user.refreshToken = tokens.refresh_token;

      await user.save();
      return {
        message: 'success',
        ...tokens,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

export interface UserInRequest {
  user: User;
}
