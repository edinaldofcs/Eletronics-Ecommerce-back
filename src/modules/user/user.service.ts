import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import { CartProductDTO } from '../cart/cart.dto';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(newData: UserDTO) {
    const data = {
      ...newData,
      password: await bcrypt.hash(newData.password, 10),
    };
    const userEmailExist = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userEmailExist) return;

    const user = await this.prisma.user.create({
      data,
    });

    delete user.password;

    return user;
  }

  async updateUserCart(id: string) {
    const findCarts = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        cart: true,
      },
    });
    return this.listUserCartItems(findCarts);
  }

  async listUserCartItems(user: UserDTO) {
    let id: { id: string }[] = [];
    user.cart.forEach((cart) => {
      id.push({ id: cart.productId });
    });

    const products = await this.prisma.product.findMany({
      where: {
        OR: [...id],
      },
    });

    const items = this.addProduct(products, user);

    return items;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        cart: true,
      },
    });

    return user;
  }

  addProduct(products: any, user: any) {
    const items: CartProductDTO[] = [];
    for (const product of products) {
      for (const cart of user.cart) {
        if (
          product.id === cart.productId &&
          product.quantity >= cart.quantity
        ) {
          //avaliable
          product.quantity = cart.quantity;
          product.id = cart.id;
        }
      }
      let { id, name, quantity } = product;
      let img = JSON.parse(product.img)[0];
      let price = product.price - product.price * product.discount;
      items.push({ id, name, price, quantity, img });
    }
    return items;
  }

  async findUserCart(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include:{
        cart: true,
      }
    });
  }
}
