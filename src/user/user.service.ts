import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  private readonly repositoryUser =
    this.prisma.user;

  async create(createUserDto: CreateUserDto) {
    return await this.repositoryUser.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findAll() {
    const findUsers =
      await this.repositoryUser.findMany();
    ['isDeleted', 'deleteAt'].forEach((key) => {
      findUsers.forEach(
        (user) => delete user[key],
      );
    });
    return findUsers;
  }

  async findOne(id: string) {
    const findUser =
      await this.repositoryUser.findUnique({
        where: {
          id,
        },
      });
    ['isDeleted', 'deleteAt'].forEach((key) => {
      delete findUser[key];
    });
    return findUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    const updateUser =
      await this.repositoryUser.update({
        where: {
          id,
        },
        data: {
          ...updateUserDto,
        },
      });
    ['isDeleted', 'deleteAt'].forEach((key) => {
      delete updateUser[key];
    });
    return updateUser;
  }

  remove(id: string) {
    return this.repositoryUser.delete({
      where: {
        id,
      },
    });
  }
}
