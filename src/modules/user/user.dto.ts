export type UserDTO = {
  email: string;
  password: string;
  name: string;
  confirmpassword?: string;
  id?: string;
  purchases?: string[];
  cart?: string[];
};

export type UserResponse = {
  email: string;
  name: string;
  id?: string;
  token?: string;
  purchases?: string[];
  cart?: string[];
} | {error: string}
