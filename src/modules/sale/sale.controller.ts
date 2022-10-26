import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { UserDTO } from '../user/user.dto';
import { SaleService } from './sale.service';

@Controller('checkout')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @IsPublic()
  @Get('success')
  async createMany(@Query() query: { success: string, id:string, token:string }, @Res() res, @Body() body) {
    const { success, id, token } = query;   
    
    if (success == 'true' && id ) {
      const pedido = await this.saleService.createSale(id);
      if(!pedido){
        return res.redirect(`${process.env.BASE_URL_FRONT}/falha`)
      }      
      return res.redirect(`${process.env.BASE_URL_FRONT}/sucesso?token=${token}`);
    }
  }

}
