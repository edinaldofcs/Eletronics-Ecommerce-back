import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { UserDTO, UserResponse } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('register')
  async register(@Body() data: UserDTO, @Res() res) {
    const user: UserResponse = await this.userService.register(data);
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new BadRequestException('Email inválido'));
    }
    
    return res.status(HttpStatus.CREATED).json();
  }

  // @IsPublic()
  // @Post('login')
  // async login(@Body() data: UserDTO, @Res() res) {
  //   const user = await this.userService.login(data);
  //   if (!user) {
  //     return res
  //       .status(HttpStatus.UNAUTHORIZED)
  //       .json(new UnauthorizedException('Usuário e/ou senha inválido(s)'));
  //   }
  //   return res.status(HttpStatus.OK).json(user);
  // }

  @Get('updateUserCart')
  async updateUserCart(@CurrentUser() userInfo: UserDTO, @Res() res) {
    const user = await this.userService.updateUserCart(userInfo);

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(new UnauthorizedException('Credenciais inválidas'));
    }
    return res.status(HttpStatus.OK).json(user);
  }
}
