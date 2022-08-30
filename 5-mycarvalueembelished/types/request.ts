import { User } from 'src/users/user.entity';

export interface IRequest extends Request {
  user?: User;
}
