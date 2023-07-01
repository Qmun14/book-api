import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register(jwtConfig), UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
// eslint-disable-next-line prettier/prettier
export class AuthModule { }
