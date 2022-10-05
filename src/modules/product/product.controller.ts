import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Http2ServerResponse } from 'http2';
import { ProductDTO } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createmany')
  async createMany() {
    return this.productService.createMany();
  }
  @Post('create/:id')
  async create(@Param('id') id: string, @Body() data: ProductDTO) {
    return this.productService.create(id, data);
  }

  @Get('category/:id')
  async listproducts(@Param('id') id: string) {
    return this.productService.listByCategory(id);
  }

  @Get('bestsellers')
  async bestsellers(@Param('id') id: string) {
    return this.productService.bestSellers(id);
  }

  @Post('purchase/:id')
  async purchase(@Param('id') id: string) {
   
    return this.productService.purchase(id);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

}
