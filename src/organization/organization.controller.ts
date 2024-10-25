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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateOrganizaitonSerializeDTO } from './dto/create-org-serialize.dto';
import { MongooseIdDTO } from 'src/dtos/mongoose-id.dto';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevels } from 'src/auth/decorators/access-level.decorator';
import { AccessLevel } from 'src/user/access-level.enum';
import { OrganizationDTO } from './dto/organizaiton.dto';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { UpdateOrganizationSerializeDTO } from './dto/update-org-serialize.dto';
import { Request } from 'express';
import {UserInRequest } from 'src/user-auth/user-auth.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Serialize(CreateOrganizaitonSerializeDTO)
  @UseGuards(RolesGuard)
  @AccessLevels(AccessLevel.Admin)
  @UseGuards(AuthGaurd)
  @Post()
  async createOrganization(@Body() createObj: CreateOrganizaitonDTO) {
    return await this.organizationService.createOrganization(createObj);
  }

  @Serialize(OrganizationDTO)
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getOrganizationById(@Param() paramObj: MongooseIdDTO) {
    return await this.organizationService.getOrganizationById(paramObj.id);
  }

  @Serialize(UpdateOrganizationSerializeDTO)
  @UseGuards(RolesGuard)
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

  @UseGuards(RolesGuard)
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
}

