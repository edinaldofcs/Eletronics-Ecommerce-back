import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
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

  @Get('updateUserCart')
  async updateUserCart(@CurrentUser() userInfo: UserDTO, @Res() res) {
    const user = await this.userService.updateUserCart(userInfo.id);

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(new UnauthorizedException('Credenciais inválidas'));
    }

    return res.status(HttpStatus.OK).json(user);
  }

  @Get('validatetoken')
  async validateToken(@CurrentUser() userInfo: UserDTO, @Res() res) {

    const user = await this.userService.findUserCart(userInfo.id)
   console.log("teste");
   
    return res.status(HttpStatus.OK).json({ cart: user.cart });    
    
  }
}
