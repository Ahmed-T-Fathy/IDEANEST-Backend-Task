import { Exclude, Expose } from 'class-transformer';

export class GetUserDTO {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  access_level: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
