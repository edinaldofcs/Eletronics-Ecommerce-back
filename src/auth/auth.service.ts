import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/modules/user/user.dto';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isEqualsPassword = bcrypt.compareSync(password, user.password);
      if (isEqualsPassword) {
        return {
          ...user,
          password: undefined,
        };
      }
    }
    throw new Error('Email e/ou senha inválido(s)');
  }

  async login(user: UserDTO) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken = this.jwtService.sign(payload);

    const myUser = {
      acess_token: jwtToken,
      userName: payload.name,
    };

    if (user.cart.length === 0) {
      return {
        ...myUser,
      };
    }

    const products = await this.userService.listUserCartItems(user);
    return {
      ...myUser,
      cart: products,
    };
  }
}
