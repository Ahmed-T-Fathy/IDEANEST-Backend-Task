import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
// import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UserModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[UserModule]
})
export class AuthModule {}
