import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login-response.interface';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) { }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const access_token = await this.createAccessToken(user);
    return access_token;
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
}
