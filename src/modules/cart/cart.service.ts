import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import { CartDTO } from './cart.dto';
import { deleteCart } from './utils/deleteSingleCart';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(data: CartDTO) {
    const CarExist = await this.prisma.cart.findFirst({
      where: {
        userId: data.userId,
        productId: data.productId,
      },
    });

    const product = await this.prisma.product.findFirst({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new Error('este produto não existe');
    }

    if (CarExist) {
      if (product.quantity > CarExist.quantity) {
        return await this.updateCart(CarExist.id, 1);
      }
      throw new Error('Não é possível inserir mais produtos');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new Error('este usuario não existe');
    }

    const addProduct = await this.prisma.cart.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        quantity: 1,
      },
    });

    return addProduct;
  }

  async updateCart(id: string, qtde: number) {
    const CarExist = await this.prisma.cart.findFirst({
      where: {
        id,
      },
    });

    if (CarExist) {
      if (qtde === 1) {
        const product = await this.prisma.product.findFirst({
          where: {
            id: CarExist.productId,
          },
        });

        if (product.quantity > CarExist.quantity) {
          return await this.prisma.cart.update({
            where: {
              id: CarExist.id,
            },
            data: {
              quantity: CarExist.quantity + 1,
            },
          });
        }
        throw new Error('Não é possível inserir mais produtos');
      } else {
        if (CarExist.quantity > 1) {
          return await this.prisma.cart.update({
            where: {
              id,
            },
            data: {
              quantity: CarExist.quantity + qtde,
            },
          });
        }
        throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);
      }
    }
  }

  async updateAmount(id: string, data:{qtde: number}) {
    return this.updateCart(id, data.qtde);
  }

  async deleteCart(id: string) {
    return await deleteCart(id);
  }

  async deleteAllCarts(id: string) {
    return await this.prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });
  }
}
