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
import { UserDTO, UserResponse } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: UserDTO, @Res() res) {
    const user: UserResponse = await this.userService.register(data);
    if (!user) {
      return res
        .status(HttpStatus.CONFLICT)
        .json(new ConflictException("Já existe um cadastro para este email"));
    }
    if (!user.token) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new InternalServerErrorException(
            'Sistema indisponível. Por favor, tente mais tarde',
          ),
        );
    }
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Post('login')
  async login(@Body() data: UserDTO, @Res() res) {
    const user = await this.userService.login(data);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(new UnauthorizedException('Usuário e/ou senha inválido(s)'));
    }
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('updateUserCart/:id')
  async updateUserCart(@Param('id') id: string, @Res() res) {
    const user = await this.userService.updateUserCart(id);

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(new UnauthorizedException('Credenciais inválidas'));
    }
    return res
        .status(HttpStatus.OK)
        .json(user);
  }
}
