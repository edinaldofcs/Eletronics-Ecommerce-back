import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CartDTO } from './cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("add")
  async addToCart(@Body() data: CartDTO) {
    return this.cartService.addToCart(data);  
  }

  @Put("update/:id")
  async reduceAmount(@Param("id") id: string, @Body() data:{qtde:number}) {
    return this.cartService.updateAmount(id, data);
  }

  @Delete("delete/:id")
  async deleteCart(@Param("id") id: string) {
    return this.cartService.deleteCart(id);
  }

  @Delete("deleteall/:id")
  async deleteAllCarts(@Param("id") id: string) {
    return this.cartService.deleteAllCarts(id);
  }
}
