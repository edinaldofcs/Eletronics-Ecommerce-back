import { BadRequestException, Body, Controller, Delete, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
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

  @Post("checkout/:token")
  async createCheckoutSession(@CurrentUser() user: UserDTO, @Res() res, @Param('token') token: string){
    const { id } = user;
    const url = await this.cartService.createCheckoutSession(id, token)
    if(url.status != "open"){
      return res.status(HttpStatus.BAD_REQUEST).json(new BadRequestException('Não foi possível prosseguir com a sua solicitação.'));
    }
    return res.status(HttpStatus.OK).json({statusCode: 200, url: url.url});
  }
}
