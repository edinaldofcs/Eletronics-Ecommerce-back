import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Http2ServerResponse } from 'http2';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { UserDTO } from '../user/user.dto';
import { ProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @IsPublic()
  @Post('createmany')
  async createMany() {
    // return
    return this.productService.createMany();
  }
  
  @Post('create/:id')
  async create(@Param('id') id: string, @Body() data: ProductDTO) {
    return
    return this.productService.create(id, data);
  }
  
  @IsPublic()
  @Get('bestsellers')
  async bestsellers(@Param('id') id: string) {
    return this.productService.bestSellers(id);
  }

  @Post('purchase')
  async purchase(@CurrentUser() user: UserDTO) {
    const { id } = user;
    return this.productService.purchase(id);
  }

  @IsPublic()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

}
