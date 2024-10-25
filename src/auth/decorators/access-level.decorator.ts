import { SetMetadata } from "@nestjs/common";
import { AccessLevel } from "../../user/access-level.enum";

export const ACCESSLEVEL_KEY ='access_level';
export const AccessLevels = (...access_levels: AccessLevel[]) =>
  SetMetadata(ACCESSLEVEL_KEY, access_levels);