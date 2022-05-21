import { Injectable, NotFoundException } from '@nestjs/common';
import { IJwtConfig } from 'src/common/interfaces/IJwtConfig';
import { CacheKeyPrefixEnum } from 'src/constants/cache-key-prefix.enum';
import { ApiConfigService } from 'src/services/api.config.service';
import { RedisService } from 'src/services/redis.service';
import { UserDto } from 'src/user/dtos/user.dto';
import { UserService } from 'src/user/user.service';
import { IUserInfo } from './interfaces/IUserInfo';
import { sign } from 'jsonwebtoken';
import { AccessPayloadDto } from './dtos/access-payload.dto';

@Injectable()
export class JwtStrategy {
  private readonly config: IJwtConfig;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {
    this.config = apiConfigService.jwtConfig;
  }

  private getCachingKey(prefix, publicAddress) {
    return `${prefix}:${publicAddress}`;
  }

  async generateAccessPayload(
    dataUser: UserDto | IUserInfo,
  ): Promise<AccessPayloadDto> {
    const user = await this.userService.findByPublicAddressOrCreate(
      dataUser.publicAddress,
    );
    if (!user) {
      throw new NotFoundException();
    }

    const accessToken = sign({ user }, this.config.secret, {
      expiresIn: this.config.accessTokenExpiry,
    });

    await this.redisService.set(
      this.getCachingKey(CacheKeyPrefixEnum.ACCESS_TOKEN, user.publicAddress),
      accessToken,
      this.config.accessTokenExpiry / 1000 + this.config.refreshTimeExpiry,
    );

    return { user, accessToken };
  }
}
