import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dtos/user.dto';

export class AccessPayloadDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  accessToken: string;
}
