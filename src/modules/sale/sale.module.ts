import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { PrismaService } from 'src/database/dbServices';

@Module({
  controllers: [SaleController],
  providers: [SaleService, PrismaService]
})
export class SaleModule {}
