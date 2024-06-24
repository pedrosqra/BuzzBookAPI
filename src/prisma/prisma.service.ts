import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    });
  }

  cleanDbForTesting() {
    return this.$transaction([
      this.order.deleteMany(),
      this.user.deleteMany(),
      this.book.deleteMany(),
      this.category.deleteMany()
    ]);
  }
}
