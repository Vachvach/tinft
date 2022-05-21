import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  publicAddress: string;

  @ApiProperty()
  authNonce: string;
}
