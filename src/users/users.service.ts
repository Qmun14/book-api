import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

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

  // async validatePassword(password: string): Promise<boolean> {
  //   const hash = await bcrypt.hash(password, );
  // }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.dbService.user.findUnique({
        where: { email },
      });
      if (user) {
        const { salt } = user;
        const hash = await bcrypt.hash(password, salt);
        if (user && hash === user.password) {
          return user;
        }
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }
  async findUserById(id: string): Promise<User> {
    return await this.dbService.user.findUnique({
      where: { id },
      include: { refreshToken: true },
    });
  }
}
