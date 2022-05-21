import { IAbstract } from 'src/interfaces/IAbstract';
import { UserDto } from '../dtos/user.dto';

export interface IUser extends IAbstract<UserDto> {
  publicAddress: string;
}
