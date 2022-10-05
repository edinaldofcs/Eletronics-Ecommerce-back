import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { SaleModule } from './modules/sale/sale.module';

@Module({
  imports: [UserModule, ProductModule, CartModule, CategoryModule, SaleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
