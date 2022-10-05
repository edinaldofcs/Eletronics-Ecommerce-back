import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import products from 'src/mock/product.mock';
import { CartDTO } from '../cart/cart.dto';
import { deleteCart } from '../cart/utils/deleteSingleCart';
import { ProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(id: string, data: ProductDTO) {
    const productExist = await this.prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (productExist) {
      throw new Error('Este produto já existe');
    }

    const product = await this.prisma.product.create({
      data: { ...data, categoryId: id },
    });

    return product;
  }

  async createMany() {
    products.map(async (data) => {
      await this.prisma.product.create({
        data,
      });
    });
    return;
  }

  async listByCategory(category: string) {
    const categoryExist = await this.prisma.category.findMany({
      where: {
        name: category,
      },
    });

    if (!categoryExist) {
      throw new Error('Esta categoria não existe');
    }

    const products = await this.prisma.category.findUnique({
      where: {
        id: category,
      },
      include: {
        products: true,
      },
    });

    return products;
  }

  async getOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    return product;
  }

  async bestSellers(id: string) {
    const products = await this.prisma.product.findMany({
      take: 5,
      where: {
        id,
      },
      orderBy: [
        {
          sold: 'desc',
        },
      ],
    });

    return products;
  }

  async purchase(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        cart: true,
      },
    });

    if (!user) {
      throw new Error('Este usuário não existe');
    }

    if (user.cart.length === 0) {
      throw new Error('O carrinho está vazio');
    }
    const salesOrder = await this.prisma.sale.create({
      data: {
        userId: id,
      },
    });

    if (!salesOrder) {
      throw new Error('Não foi possível criar a ordem de Venda');
    }

    let sales = [];

    for (const cart of user.cart) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: cart.productId,
        },
      });
      if (product.quantity >= cart.quantity) {
        await this.prisma.product.update({
          where: {
            id: cart.productId,
          },
          data: {
            quantity: {
              decrement: cart.quantity,
            },
            sold: {
              increment: 1,
            },
          },
        });
        const sale = await this.prisma.productSale.create({
          data: {
            saleId: (await salesOrder).id,
            productId: cart.productId,
            quantity: cart.quantity,
          },
        });
        await deleteCart(cart.id)
        sales.push(sale);
      }
    }

    return sales;
  }
}
