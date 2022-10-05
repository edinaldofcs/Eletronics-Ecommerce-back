import { Body, ConflictException, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { CategoryDTO } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: CategoryDTO, @Res() res) {  
    return res.status(HttpStatus.UNAUTHORIZED).json("Rota proibída");
    const category = await this.categoryService.create(data);
    if (!category) {
      return res
        .status(HttpStatus.CONFLICT)
        .json(new ConflictException("Já existe uma categoria com este nome!"));
    }
    return res.status(HttpStatus.CREATED).json(category);
  }

  @Post("createmany")
  async createMany(@Res() res) {  
    return res.status(HttpStatus.UNAUTHORIZED).json("Rota proibída");  
    return this.categoryService.createMany();
  }

  @Get()
  async listAll() {    
    return await this.categoryService.listAll();
  }

  @Get(":name")
  async listOne(@Param("name") name:string, @Res() res) {    
    const category = await this.categoryService.listOne(name);

    if (!category) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(new ConflictException("Esta categoria não existe!"));
    }

    return res.status(HttpStatus.OK).json(category);
  }

}
