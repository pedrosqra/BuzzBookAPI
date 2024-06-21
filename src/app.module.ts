import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { UserController } from './user/user.controller';
import { BookController } from './book/book.controller';
import { UserService } from './user/user.service';
import { CategoryService } from './category/category.service';
import { BookService } from './book/book.service';

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
  ],
  controllers: [
    OrderController,
    CategoryController,
    UserController,
    BookController,
    OrderController
  ],
  providers: [
    OrderService,
    UserService,
    CategoryService,
    BookService
  ]
})
export class AppModule {}
