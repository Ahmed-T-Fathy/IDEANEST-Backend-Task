import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateOrganizaitonDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;
}