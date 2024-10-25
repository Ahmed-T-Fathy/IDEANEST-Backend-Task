import { Exclude, Expose, Type } from "class-transformer";
import { Organization } from "../organization.schema";
import { OrganizationDTO } from "./organizaiton.dto";
import { OrganizationMemberDTO } from "./organization-member.dto";

export class UpdateOrganizationSerializeDTO extends OrganizationDTO {
  @Expose()
  _id: string;

  @Exclude()
  @Type(() => OrganizationMemberDTO)
  organization_members: OrganizationMemberDTO[];
}