import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import { SaleDTO } from './sale.dto';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async createSale(id: string) {
    const sale: SaleDTO = await this.prisma.sale.create({
      data: {
        userId: id,
      },
    });

    if (!sale) return false;

    const products = await this.prisma.cart.findMany({
      where: {
        userId: id,
      },
    });

    for (const product of products) {
      const createProduct = await this.prisma.productSale.create({
        data: {
          productId: product.productId,
          saleId: sale.id,
          quantity: product.quantity,
        },
      });
      const update = await this.updateProduct(product);
    }

    const deleteCart = await this.prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });

    return true
  }

  async updateProduct(product: any) {
    await this.prisma.product.update({
      where: {
        id: product.productId,
      },
      data: {
        quantity: {
          decrement: product.quantity,
        },
        sold: {
          increment: product.quantity,
        },
      },
    });
  }
}
