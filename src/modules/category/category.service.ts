import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/dbServices';
import categories from 'src/mock/category.mock';
import { CategoryDTO } from '../category/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(data: { name: string }) {
    const categoryExist = await this.prisma.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (categoryExist) return;

    const category = await this.prisma.category.create({
      data,
    });

    return category;
  }

  async createMany() {
    const cat = categories;
    cat.map(async (data) => {
      await this.prisma.category.create({
        data,
      });
    });
    return;
  }

  async listAll() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async listOne(name: string) {
    const newName = name[0].toUpperCase() + name.substring(1).toLocaleLowerCase(); 
    
    const category = await this.prisma.category.findUnique({
      where: {
        name: newName,
      },
      include: {
        products: true,
      },
    });

    if (!category) return;
    return category;
  }
}
