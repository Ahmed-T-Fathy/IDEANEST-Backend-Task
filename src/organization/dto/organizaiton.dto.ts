import { Expose, Type } from 'class-transformer';
import { OrganizationMemberDTO } from './organization-member.dto';

export class OrganizationDTO {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => OrganizationMemberDTO)
  organization_members: OrganizationMemberDTO[];
}
