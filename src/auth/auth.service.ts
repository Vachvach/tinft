import { BadRequestException, Injectable } from '@nestjs/common';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { CacheKeyPrefixEnum } from 'src/constants/cache-key-prefix.enum';
import { UtilsProvider } from 'src/providers/utils.provider';
import { ApiConfigService } from 'src/services/api.config.service';
import { RedisService } from 'src/services/redis.service';
import { MetamaskAuthNonceDto } from './dtos/metamaskAuthNonceDto';
import { IMetamaskUserInfo } from './interfaces/IMetamaskUserInfo';
import { IUserInfo } from './interfaces/IUserInfo';
import { LoginDto } from './dtos/login.dto';
import { MetamaskUserInfoDto } from './dtos/metamaskUserInfoDto';
import { JwtStrategy } from './jwt.strategy';
import { AccessPayloadDto } from './dtos/access-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    public readonly apiConfigService: ApiConfigService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async login(login: LoginDto): Promise<AccessPayloadDto> {
    const userInfo = await this.metamaskUserInfo(
      new MetamaskUserInfoDto({
        publicAddress: login.publicAddress,
        signedAuthMessage: login.authNonce,
      }),
    );

    return this.jwtStrategy.generateAccessPayload(userInfo);
  }

  async getAuthNonce(publicAdress: string): Promise<MetamaskAuthNonceDto> {
    const nonce = UtilsProvider.generateNonce();
    await this.redisService.set(
      `${CacheKeyPrefixEnum.METAMASK_AUTH_NONCE}:${publicAdress}`,
      nonce,
      this.apiConfigService.authNonceExpiry,
    );
    return { nonce };
  }

  async metamaskUserInfo(
    metamaskUserInfo: IMetamaskUserInfo,
  ): Promise<IUserInfo> {
    const cachedAuthNonce = await this.redisService.get(
      `${CacheKeyPrefixEnum.METAMASK_AUTH_NONCE}:${metamaskUserInfo.publicAddress}`,
    );

    const message = UtilsProvider.getMetamaskAuthMessage(
      metamaskUserInfo.publicAddress,
      cachedAuthNonce,
    );

    const address = recoverPersonalSignature({
      data: message,
      signature: metamaskUserInfo.signedAuthMessage,
    });

    if (
      address.toLowerCase() !== metamaskUserInfo.publicAddress.toLowerCase()
    ) {
      throw new BadRequestException();
    }

    return {
      publicAddress: metamaskUserInfo.publicAddress,
      signedAuthMessage: cachedAuthNonce,
    };
  }
}
