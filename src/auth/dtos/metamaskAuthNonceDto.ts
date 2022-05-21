import { ApiProperty } from '@nestjs/swagger';

export class MetamaskAuthNonceDto {
  @ApiProperty()
  nonce: string;
}
