import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';

export const jwtConfig: JwtModuleOptions = {
  secret: jwtSecret,
  signOptions: {
    expiresIn: 60,
  },
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 3600 * 24,
};
