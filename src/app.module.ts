import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LoggingMiddleWare } from './middlewares/logging.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserAuthService } from './user-auth/user-auth.service';
import { UserAuthController } from './user-auth/user-auth.controller';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGODB_CONNECTION_STRING'),
        };
      },
    }),
    UserModule,
    UserAuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global:true,
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRESIN') },
        };
      },
    }),
    OrganizationModule,
  ],
  controllers: [AppController, UserAuthController],
  providers: [AppService, UserAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleWare).forRoutes('*');
  }
}
