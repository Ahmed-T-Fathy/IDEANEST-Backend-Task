import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CreateUserDTO } from './dots/create-user.dto';
import { UserService } from './user.service';
import { GetAllUsersDTO } from './dots/get-all-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Post()
  async createUser(@Body() createObj: CreateUserDTO) {
    return await this.UserService.createUser(createObj);
  }

  @Get()
  async getAllUsers(@Query() queryObj: GetAllUsersDTO, @Request() req) {
    return this.UserService.getAllUsers(queryObj, req);
  }
}
