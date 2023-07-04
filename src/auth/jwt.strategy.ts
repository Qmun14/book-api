import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, //! set ke false kalau sudah di production
      secretOrKey: jwtConfig.secret,
    });
  }

  /**
   * Karena class JwtStrategy yang kita buat mengimplement class PassportStrategy maka kita harus wajib mengoveride fungsi validate nya untuk kita gunakan sesuai strategy kita
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    const user = await this.usersService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User is not found.');
    }
    return user;
  }
}
