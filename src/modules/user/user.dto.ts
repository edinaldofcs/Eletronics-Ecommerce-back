import { CartDTO } from "../cart/cart.dto";

export type UserDTO = {
  email: string;
  password: string;
  name: string;
  id?: string;
  purchases?: string[];
  cart?: CartDTO[];
};

export type UserResponse = {
  email: string;
  name: string;
  id?: string;
  token?: string;
  purchases?: string[];
  cart?: string[];
}