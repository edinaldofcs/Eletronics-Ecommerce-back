import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/database/dbServices';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService]
})
export class CartModule {}
