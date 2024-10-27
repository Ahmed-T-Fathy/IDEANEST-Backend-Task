import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { SignupDTO } from '../../user-auth/dtos/signup.dto';
import { AccessLevel } from '../access-level.enum';
export class CreateUserDTO extends PartialType(SignupDTO) {
  @IsNotEmpty()
  @IsEnum(AccessLevel)
  access_level: AccessLevel;
}
