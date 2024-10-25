import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  name: String;

  @IsNotEmpty()
  @IsEmail()
  email: String;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
