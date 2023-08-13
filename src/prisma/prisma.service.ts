import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  PrismaClient,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
    this.$use(this.categoryFindMiddleware);
    this.$use(this.categorySoftDeleteMiddleware);
  }

  categoryFindMiddleware: Prisma.Middleware =
    async (params, next) => {
      if (
        params.action === 'findUnique' ||
        params.action === 'findFirst'
      ) {
        return next({
          ...params,
          action: 'findFirst',
          args: {
            ...params.args,
            where: {
              ...params.args?.where,
              isDeleted: false,
            },
          },
        });
      }
      if (params.action === 'findMany') {
        return next({
          ...params,
          args: {
            ...params.args,
            where: {
              ...params.args?.where,
              isDeleted: false,
            },
          },
        });
      }
      return next(params);
    };

  categorySoftDeleteMiddleware: Prisma.Middleware =
    async (params, next) => {
      if (params.action === 'delete') {
        return next({
          ...params,
          action: 'update',
          args: {
            ...params.args,
            data: {
              isDeleted: true,
              deleteAt: new Date(),
            },
          },
        });
      }
      return next(params);
    };

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
