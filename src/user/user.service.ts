import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dots/create-user.dto';
import { GetAllUsersDTO } from './dots/get-all-users.dto';
import { APIresponse } from '../helpers/api-response';
import { Request } from 'express';
import { AccessLevel } from './access-level.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
   
  }
  async createUser(createObj: CreateUserDTO): Promise<User> {
    try {
      const newUser = new this.userModel(createObj);
      return await newUser.save();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async getAllUsers(data: GetAllUsersDTO, req: Request): Promise<APIresponse> {
    try {
      let filterBy: any = {};
      if (data.email) {
        filterBy.email = { $regex: data.email, options: 'i' };
      }
      if (data.name) {
        filterBy.name = { $regex: data.name, options: 'i' };
      }
      if (data.access_level) {
        filterBy.access_level = data.access_level;
      }

      let totalCount: number = await this.userModel.countDocuments(filterBy);
      const skip = (data.page - 1) * data.limit;
      let pageCount: number = Math.round(totalCount / data.limit);

      const orderBy: { [key: string]: 'asc' | 'desc' } = {};

      if (data.orderBy) {
        data.orderBy.split(',').forEach((field) => {
          const direction = field.startsWith('-') ? 'desc' : 'asc';
          const fieldName = field.startsWith('-') ? field.slice(1) : field;
          orderBy[fieldName] = direction;
        });
      }

      const users = await this.userModel
        .find({ ...filterBy })
        .sort(orderBy)
        .skip(skip)
        .limit(data.limit);
      return new APIresponse(
        users,
        data.page,
        data.limit,
        pageCount,
        totalCount,
        req,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).select('password');
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getUserByToken(refreshToken: string): Promise<User>{
    try {
      const user = await this.userModel.findOne({ refreshToken });
      if (!user) throw new NotFoundException('User Not Found');
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
