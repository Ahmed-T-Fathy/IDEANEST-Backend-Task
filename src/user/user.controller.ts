import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dots/create-user.dto';
import { UserService } from './user.service';
import { GetAllUsersDTO } from './dots/get-all-users.dto';
import { AuthGaurd } from '../auth/guards/auth.guard';
import { AccessLevels } from '../auth/decorators/access-level.decorator';
import { AccessLevel } from './access-level.enum';
import { AccessLevelGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Post()
  async createUser(@Body() createObj: CreateUserDTO) {
    return await this.UserService.createUser(createObj);
  }
  
  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Get()
  async getAllUsers(@Query() queryObj: GetAllUsersDTO, @Request() req) {
    return this.UserService.getAllUsers(queryObj, req);
  }
}
