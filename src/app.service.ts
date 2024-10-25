import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello From IDEANEST Task Created By Ahmed Tarek!';
  }
}
