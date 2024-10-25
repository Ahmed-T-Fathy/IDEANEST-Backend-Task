import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[MongooseModule.forFeatureAsync([
      {
        name: Organization.name,
        useFactory: () => {
          const schema = OrganizationSchema;
          return schema;
        },
      },
  ]),
  AuthModule
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
