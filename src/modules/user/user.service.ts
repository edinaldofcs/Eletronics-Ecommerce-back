import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import { CartProductDTO } from '../cart/cart.dto';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(data: UserDTO) {
    const userEmailExist = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userEmailExist)
      return  

    const user = await this.prisma.user.create({
      data,
    });

    delete user.password;
    //criar token
    // user["token"] = "teste"  

    return user;
  }

  async login(data: UserDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
      include: {
        cart: true,
      },
    });

    if (!user) return false;
    if (user.password !== data.password) return false;

    if (user.cart.length == 0) {
      return user;
    }

    let id: { id: string }[] = [];
    user.cart.forEach((element) => {
      id.push({ id: element.productId });
    });

    const products = await this.prisma.product.findMany({
      where: {
        OR: [...id],
      },
    });

    const items = this.addProduct(products, user);   

    delete user.password;
    return { ...user, cart: { id: user.cart[0].id, items } };
  }

  addProduct(products:any, user:any){
    const items: CartProductDTO[] = []
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
      let { id, name, price, quantity } = product;
      let img = JSON.parse(product.img)[0];
      items.push({ id, name, price, quantity, img });
    }
    return items
  }

  async updateUserCart(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        cart: true,
      },
    });

    if (!user) return;

    if (user.cart.length == 0) {
      return user;
    }

    let cartId: { id: string }[] = [];
    user.cart.forEach((element) => {
      cartId.push({ id: element.productId });
    });

    const products = await this.prisma.product.findMany({
      where: {
        OR: [...cartId],
      },
    });

    const items = this.addProduct(products, user);  

    delete user.password;
    return { ...user, cart: { id: user.cart[0].id, items } };
  }
}
