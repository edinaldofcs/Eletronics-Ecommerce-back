import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import { ProductDTO } from '../product/product.dto';
import { UserDTO } from '../user/user.dto';
import { CartDTO, CheckoutDTO } from './cart.dto';
// import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { deleteCart } from './utils/deleteSingleCart';
const stripe = require("stripe")(process.env.STRIPE_KEY);
@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    // @InjectStripe() private readonly stripeClient: Stripe,
  ) {}

  async addToCart(productId: string, user: UserDTO) {
    const CarExist = await this.prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
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

    const addProduct = await this.prisma.cart.create({
      data: {
        userId: user.id,
        productId: productId,
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

  async updateAmount(id: string, data: { qtde: number }) {
    return this.updateCart(id, data.qtde);
  }

  async deleteCart(id: string) {
    return await deleteCart(id);
  }

  async deleteAllCarts(userId: string) {
    return await this.prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
  }

  async createCheckoutSession(userId: string, token: string) {
    const cart = await this.prisma.cart.findMany({
      where: {
        userId,
      },
    });

    const products: CheckoutDTO[] = [];
    for (const productCart of cart) {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productCart.productId,
        },
      });
     
      const newPrice = (
        parseFloat(
          (Number(product.price) * (1 - Number(product.discount))).toFixed(2),
        ) * 100
      ).toFixed(0);

      const newProduct = {
        price_data: {
          currency: 'brl',
          product_data: {
            name: product.name,
          },
          unit_amount_decimal: newPrice,
        },
        quantity: Number(productCart.quantity),
      };
      products.push(newProduct);
    }

    const session = await stripe.checkout.sessions.create({
      line_items: products,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/checkout/success?success=true&id=${userId}&token=${token}`,
      cancel_url: `${process.env.BASE_URL}/checkout/canceled?success=false`,
    });

    return { status: session.status, url: session.url };
  }
}
