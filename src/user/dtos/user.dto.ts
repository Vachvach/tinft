import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/common/dtos/abstract.dto';
import { IUser } from '../interface/IUser';

export class UserDto extends AbstractDto {
  @ApiProperty()
  publicAddress: string;

  constructor(user: IUser) {
    super(user);
    this.publicAddress = user.publicAddress;
  }
}
