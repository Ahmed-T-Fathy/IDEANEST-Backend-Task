import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { Users } from 'src/users/users.entity';
// import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
// import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UserModule,
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config:ConfigService) => {
      return {
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRESIN') },
      };
    }
  })],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[JwtModule,UserModule]
})
export class AuthModule {}
