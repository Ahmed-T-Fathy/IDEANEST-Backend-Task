import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizaitonDTO } from './dto/create-organization.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateOrganizaitonSerializeDTO } from './dto/create-org-serialize.dto';
import { MongooseIdDTO } from '../dtos/mongoose-id.dto';
import { AuthGaurd } from '../auth/guards/auth.guard';
import { AccessLevelGuard } from '../auth/guards/roles.guard';
import { AccessLevels } from '../auth/decorators/access-level.decorator';
import { AccessLevel } from '../user/access-level.enum';
import { OrganizationDTO } from './dto/organizaiton.dto';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { UpdateOrganizationSerializeDTO } from './dto/update-org-serialize.dto';
import { Request } from 'express';
import { UserInRequest } from '../user-auth/user-auth.service';
import { InviteUserToOrganizationDTO } from './dto/invite-user-to-organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Serialize(CreateOrganizaitonSerializeDTO)
  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Post()
  async createOrganization(@Body() createObj: CreateOrganizaitonDTO) {
    return await this.organizationService.createOrganization(createObj);
  }

  @Serialize(OrganizationDTO)
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getOrganizationById(@Param() paramObj: MongooseIdDTO,@Req()req:Request) {
    return await this.organizationService.getOrganizationById(paramObj.id,req);
  }

  @Serialize(UpdateOrganizationSerializeDTO)
  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Put('/:id')
  async updateOrganization(
    @Param() paramObj: MongooseIdDTO,
    @Body() updateObj: UpdateOrganizationDTO,
  ) {
    return await this.organizationService.updateOrganization(
      paramObj.id,
      updateObj,
    );
  }

  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteOrganization(@Param() paramObj: MongooseIdDTO) {
    return await this.organizationService.deleteOrganization(paramObj.id);
  }

  //   @Serialize(OrganizationDTO)
  @UseGuards(AuthGaurd)
  @Get()
  async getOrganizations(@Req() req: Request & UserInRequest) {
    return await this.organizationService.getAllOrganizations(req, req.user);
  }

  @UseGuards(AccessLevelGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Post('/:id/invite')
  async inviteUserToOrganization(
    @Param() param: MongooseIdDTO,
    @Body() body: InviteUserToOrganizationDTO,
  ) {
    return this.organizationService.inviteUserToOrganization(param.id,body.user_email);
  }
}
