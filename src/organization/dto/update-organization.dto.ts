import { PartialType } from "@nestjs/mapped-types";
import { CreateOrganizaitonDTO } from "./create-organization.dto";

export class UpdateOrganizationDTO extends PartialType(CreateOrganizaitonDTO){}