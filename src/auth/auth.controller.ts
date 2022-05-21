import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { MetamaskAuthNonceDto } from './dtos/metamaskAuthNonceDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Get('metamask-nonce:publicAdress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MetamaskAuthNonceDto,
    description: 'getting metamask auth nonce',
  })
  async getMetamaskAuthMessage(@Param('publicAdress') publicAdress: string) {
    return this.authService.getAuthNonce(publicAdress);
  }
}
