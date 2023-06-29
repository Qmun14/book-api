import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // eslint-disable-next-line prettier/prettier
  constructor(private dbService: PrismaService) { }

  /**
   * Create User
   * @param data
   * @returns
   */
  async createUser(data: CreateUserDto) {
    const { name, email, password } = data;
    const salt = await bcrypt.genSalt();
    try {
      return await this.dbService.user.create({
        data: {
          name,
          email,
          salt: salt,
          password: await bcrypt.hash(password, salt),
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ConflictException(`Email ${email} already used`);
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }
}
