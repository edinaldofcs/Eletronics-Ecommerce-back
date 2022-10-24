import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDTO } from '../user/user.dto';
import { CartDTO } from './cart.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body('productId') productId: string,
    @CurrentUser() user: UserDTO,
  ) {
    return this.cartService.addToCart(productId, user);
  }

  @Put('update/:id')
  async reduceAmount(@Param('id') id: string, @Body() data: { qtde: number }) {
    return this.cartService.updateAmount(id, data);
  }

  @Delete('delete/:id')
  async deleteCart(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }

  @Delete('deleteAll')
  async deleteAllCarts(@CurrentUser() user: UserDTO) {
    const { id } = user;
    return this.cartService.deleteAllCarts(id);
  }
}
