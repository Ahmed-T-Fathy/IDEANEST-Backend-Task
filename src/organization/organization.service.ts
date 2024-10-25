import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.schema';
import { CreateOrganizaitonDTO } from './dto/create-organization.dto';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { Request } from 'express';
import { AccessLevel } from 'src/user/access-level.enum';
import { checkQuery } from 'src/helpers/check-query';
import { APIresponse } from 'src/helpers/api-response';
import { User } from 'src/user/user.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private readonly organizationModel,
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

  async getOrganizationById(id: string): Promise<Organization> {
    try {
      // check if user need to get organization is not form its members
      const organization = await this.organizationModel.findById(id);
      if (!organization) throw new NotFoundException('Organization Not Found');
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
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getAllOrganizations(req: Request,user:User) {
    try {
      switch (user.access_level) {
        case AccessLevel.Admin:
          return await this.getAllOrganizationsAdmin(req);
        // case AccessLevel.Read_Only:
        //   return await this.getAllOrganizationsUser(req);
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
      let totalCount: number = await this.organizationModel.countDocuments(filterBy);
        let pageCount: number = Math.ceil(totalCount / limit);
        
        const organizations = await this.organizationModel
          .find(filterBy)
          .select('-createdAt -updatedAt')
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
}
