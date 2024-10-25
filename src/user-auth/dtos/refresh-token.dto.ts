import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
