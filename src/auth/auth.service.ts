import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login-response.interface';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService, private readonly dbService: PrismaService) { }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);

    return { access_token, refresh_token } as LoginResponse;
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshAccessTokenDto,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;
    const payload = await this.decodeToken(refresh_token);
    const refreshToken = await this.dbService.refreshToken.findUnique({
      where: { id: payload.jid },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not found');
    }
    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
    const { userId } = refreshToken;
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
    });
    const access_token = await this.createAccessToken(user);
    return { access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is Expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  async createRefreshToken(user: User): Promise<string> {
    const ttl = +refreshTokenConfig.expiresIn;
    const getTime = new Date().getTime();
    const expiredAt = new Date(getTime + ttl);

    const refreshToken = await this.dbService.refreshToken.create({
      data: {
        isRevoked: false,
        expiredAt: expiredAt,
        userId: user.id,
      },
    });
    const payload = {
      jid: refreshToken.id,
    };

    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );
    return refresh_token;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    try {
      const refreshToken = await this.dbService.refreshToken.update({
        where: { id },
        data: {
          isRevoked: true,
        },
      });
      if (!refreshToken) {
        throw new NotFoundException('Refresh token is not found');
      }
    } catch (err) {
      console.log(err);
    }
  }
}
