import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BookModule,
    OrderModule,
    CategoryModule
  ]
})
export class AppModule {}
