import { Request } from 'express';
import { UserDTO } from 'src/modules/user/user.dto';

export interface AuthRequest extends Request {
  user: UserDTO;
}
