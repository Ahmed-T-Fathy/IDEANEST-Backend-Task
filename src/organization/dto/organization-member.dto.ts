import { Expose } from "class-transformer";
import { AccessLevel } from "../../user/access-level.enum";

export class OrganizationMemberDTO {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  access_level: AccessLevel;
}