import { JwtModuleOptions } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';

export const jwtConfig: JwtModuleOptions = {
  secret: jwtSecret,
  signOptions: {
    expiresIn: 60,
  },
};
