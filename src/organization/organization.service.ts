import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.schema';
import { CreateOrganizaitonDTO } from './dto/create-organization.dto';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { Request } from 'express';
import { AccessLevel } from '../user/access-level.enum';
import { checkQuery } from '../helpers/check-query';
import { APIresponse } from '../helpers/api-response';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UserInRequest } from '../user-auth/user-auth.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>,
    private readonly userService: UserService,
  ) {}

  async createOrganization(
    createObj: CreateOrganizaitonDTO,
  ): Promise<Organization> {
    try {
      const newOrganization = new this.organizationModel(createObj);
      return await newOrganization.save();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getOrganizationById(id: string, req?: Request): Promise<Organization> {
    try {
      const organization = await this.organizationModel.findById(id).populate({
        path: 'organization_members',
        select: '-password -refreshToken -createdAt -updatedAt',
      });

      if (!organization) throw new NotFoundException('Organization Not Found');

      if(req){
        const user=(req as Request& UserInRequest).user;
        if(user.access_level===AccessLevel.Read_Only){
          const existingMember = this.getExistingMembers(organization,user);
          if (!existingMember) {
            throw new UnauthorizedException('You have no permission to access this organization!');
          }
        }

      }

      return organization;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async updateOrganization(
    id: string,
    updateObj: UpdateOrganizationDTO,
  ): Promise<Organization> {
    try {
      const organization = await this.getOrganizationById(id);
      console.log(organization);
      Object.assign(organization, updateObj);
      console.log(organization);
      console.log(updateObj);

      await organization.save({ validateBeforeSave: true });
      return organization;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteOrganization(id: string) {
    try {
      const organization = await this.getOrganizationById(id);

      await organization.deleteOne();

      return {
        message: 'success',
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async inviteUserToOrganization(orgId: string, userEmail: string) {
    try {
      const organization = await this.getOrganizationById(orgId);
      const user = await this.userService.getUserByEmail(userEmail);
  
      const existingMember = this.getExistingMembers(organization,user);
  
  
      if (existingMember) {
        throw new BadRequestException('User is already a member of the organization');
      }
  
      organization.organization_members.push(user._id as Types.ObjectId);
  
      await organization.save();
  
      return {
        message: 'success',
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  

  async getAllOrganizations(req: Request, user: User) {
    try {
      switch (user.access_level) {
        case AccessLevel.Admin:
          return await this.getAllOrganizationsAdmin(req);
        case AccessLevel.Read_Only:
          return await this.getAllOrganizationsUser(req);
        default:
          throw new ConflictException(
            'Ther only two access levels Adim and Read-only',
          );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private async getAllOrganizationsAdmin(req: Request) {
    try {
      let { page, limit, skip, filterBy, sortBy } = checkQuery(req);

      if (req.query.name) {
        const name = req.query.name.toString();
        filterBy.name = { $regex: name, $options: 'i' };
      }

      if (req.query.description) {
        const description = req.query.description.toString();
        filterBy.description = { $regex: description, $options: 'i' };
      }

      let totalCount: number =
        await this.organizationModel.countDocuments(filterBy);
      let pageCount: number = Math.ceil(totalCount / limit);

      const organizations = await this.organizationModel
        .find(filterBy)
        .select('-createdAt -updatedAt')
        .populate({
          path: 'organization_members',
          select: '-_id -password -refreshToken -createdAt -updatedAt',
        })
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

      return new APIresponse(
        organizations,
        page,
        limit,
        pageCount,
        totalCount,
        req,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private async getAllOrganizationsUser(req: Request) {
    try {
      let { page, limit, skip, filterBy, sortBy } = checkQuery(req);
      const userId = (req as Request & UserInRequest).user._id;
      let pipline = [];

      if (req.query.name) {
        const name = req.query.name.toString();
        filterBy.name = { $regex: name, $options: 'i' };
      }

      if (req.query.description) {
        const description = req.query.description.toString();
        filterBy.description = { $regex: description, $options: 'i' };
      }

      if (Object.keys(filterBy).length !== 0)
        pipline.push({
          $match: {
            ...filterBy,
          },
        });

      //get only organization that user invited to it
      pipline.push({
        $match: {
          organization_members: userId,
        },
      });

      pipline.push({
        $lookup: {
          from: 'users',
          localField: 'organization_members',
          foreignField: '_id',
          as: 'organization_members',
        },
      });

      pipline.push({
        $project: {
          createdAt: 0,
          updatedAt: 0,
          'organization_members.password': 0,
          'organization_members._id': 0,
          'organization_members.refreshToken': 0,
          'organization_members.createdAt': 0,
          'organization_members.updatedAt': 0,
        },
      });

      let organizations = await this.organizationModel.aggregate(pipline);
      const totalCount = organizations.length;
      const pageCount = Math.ceil(totalCount / limit);
      if (Object.keys(sortBy).length !== 0)
        pipline.push({
          $sort: sortBy,
        });

      if (skip)
        pipline.push({
          $skip: skip,
        });

      if (limit)
        pipline.push({
          $limit: limit,
        });

      organizations = await this.organizationModel.aggregate(pipline);

      return new APIresponse(
        organizations,
        page,
        limit,
        pageCount,
        totalCount,
        req,
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  getExistingMembers(organization:Organization,user:User){
    return organization.organization_members.some(
      (member) => member._id.toString() === user._id.toString(),
    );
  }
}
